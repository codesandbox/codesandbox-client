import React, { useEffect } from 'react';
import {
  useLazyQuery,
  useMutation,
  MutationHookOptions,
} from '@apollo/react-hooks';
import { useOvermind } from 'app/overmind';
import {
  BookmarkedSandboxInfoQuery,
  BookmarkTemplateMutation,
  BookmarkTemplateMutationVariables,
  UnbookmarkTemplateMutation,
  UnbookmarkTemplateMutationVariables,
  BookmarkedSandboxInfoQueryVariables,
} from 'app/graphql/types';
import { Button } from '@codesandbox/components';
import { BOOKMARK_TEMPLATE, UNBOOKMARK_TEMPLATE } from './mutations';
import { BOOKMARKED_SANDBOX_INFO } from './queries';

export const BookmarkTemplateButton = () => {
  const {
    state: {
      isLoggedIn,
      editor: {
        currentId: sandboxId,
        currentSandbox: { customTemplate },
      },
    },
  } = useOvermind();
  const [runQuery, { loading, data }] = useLazyQuery<
    BookmarkedSandboxInfoQuery,
    BookmarkedSandboxInfoQueryVariables
  >(BOOKMARKED_SANDBOX_INFO);

  useEffect(() => {
    if (isLoggedIn) {
      runQuery({
        variables: { sandboxId },
      });
    }
  }, [isLoggedIn, runQuery, sandboxId]);

  const bookmarkInfos = data?.sandbox?.customTemplate?.bookmarked || [];

  const config = (
    entityIndex: number = 0
  ): MutationHookOptions<
    BookmarkTemplateMutation | UnbookmarkTemplateMutation,
    BookmarkTemplateMutationVariables | UnbookmarkTemplateMutationVariables
  > => {
    const bookmarkInfo = bookmarkInfos[entityIndex];

    if (!bookmarkInfo) {
      return {};
    }

    return {
      variables: {
        template: customTemplate.id,
        team: undefined,
      },
      optimisticResponse: {
        __typename: 'RootMutationType',
        template: {
          __typename: 'Template',
          id: customTemplate.id,
          bookmarked: bookmarkInfos.map(b => {
            if (b.entity.id !== bookmarkInfo.entity.id) {
              return b;
            }

            return {
              ...b,
              isBookmarked: !b.isBookmarked,
            };
          }),
        },
      },
    };
  };

  const [bookmark] = useMutation<
    BookmarkTemplateMutation,
    BookmarkTemplateMutationVariables
  >(BOOKMARK_TEMPLATE, config());
  const [unbookmark] = useMutation<
    UnbookmarkTemplateMutation,
    UnbookmarkTemplateMutationVariables
  >(UNBOOKMARK_TEMPLATE, config());

  const handleToggleFollow = (i: number = 0) =>
    bookmarkInfos[i].isBookmarked ? unbookmark(config(i)) : bookmark(config(i));

  return (
    <Button disabled={loading} onClick={() => handleToggleFollow()}>
      {bookmarkInfos[0]?.isBookmarked
        ? `Unbookmark Template`
        : `Bookmark Template`}
    </Button>
  );
};
