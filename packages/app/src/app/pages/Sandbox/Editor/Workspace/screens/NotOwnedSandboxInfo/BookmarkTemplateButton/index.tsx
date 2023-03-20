import React, { useEffect } from 'react';
import { useLazyQuery, useMutation, MutationHookOptions } from '@apollo/client';
import { useAppState } from 'app/overmind';
import {
  BookmarkedSandboxInfoQuery,
  BookmarkTemplateMutation,
  BookmarkTemplateMutationVariables,
  UnbookmarkTemplateMutation,
  UnbookmarkTemplateMutationVariables,
  BookmarkedSandboxInfoQueryVariables,
} from 'app/graphql/types';
import { Stack, Button, Icon, Menu } from '@codesandbox/components';
import { BOOKMARK_TEMPLATE, UNBOOKMARK_TEMPLATE } from './mutations';
import { BOOKMARKED_SANDBOX_INFO } from './queries';

export const BookmarkTemplateButton = () => {
  const {
    isLoggedIn,
    editor: {
      currentId: sandboxId,
      currentSandbox: { customTemplate },
    },
  } = useAppState();

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

    if (!bookmarkInfo || !customTemplate) {
      return {};
    }

    return {
      variables: {
        template: customTemplate.id,
        team:
          bookmarkInfo.entity.__typename === 'Team'
            ? bookmarkInfo.entity.id
            : undefined,
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
    <Stack>
      <Button
        disabled={loading}
        onClick={() => handleToggleFollow(0)}
        css={{
          width: 'calc(100% - 26px)',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
      >
        {bookmarkInfos[0]?.isBookmarked
          ? `Remove Bookmark`
          : `Bookmark Template`}
      </Button>
      <Menu>
        <Menu.Button
          variant="primary"
          css={{
            width: '26px',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
          }}
        >
          <Icon size={8} name="caret" />
        </Menu.Button>
        <Menu.List>
          {bookmarkInfos.map(({ entity: { name } }, index: number) => (
            <Menu.Item key={name} onSelect={() => handleToggleFollow(index)}>
              {bookmarkInfos[index].isBookmarked ? 'Remove from ' : 'Add to '}
              {index === 0 ? 'My Bookmarks' : name}
            </Menu.Item>
          ))}
        </Menu.List>
      </Menu>
    </Stack>
  );
};
