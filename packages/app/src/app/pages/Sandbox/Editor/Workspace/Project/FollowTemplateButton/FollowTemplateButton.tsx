import React, { useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useOvermind } from 'app/overmind';
import Checked from 'react-icons/lib/md/check-box';
import Unchecked from 'react-icons/lib/md/check-box-outline-blank';
import { MultiAction } from '@codesandbox/common/lib/components/MultiAction';
import { ButtonContainer, ButtonIcon } from './elements';
import { bookmarkTemplate, unbookmarkTemplate } from './mutations.gql';
import { getSandboxInfo } from './queries.gql';

interface IFollowTemplateButton {
  style?: string;
}

export const FollowTemplateButton = ({ style }: IFollowTemplateButton) => {
  const {
    state: {
      isLoggedIn,
      editor: {
        currentId: sandboxId,
        currentSandbox: { customTemplate },
      },
    },
  } = useOvermind();
  const [runQuery, { loading, data }] = useLazyQuery(getSandboxInfo);

  useEffect(() => {
    if (isLoggedIn) {
      runQuery({
        variables: { id: sandboxId || `` },
      });
    }
  }, [isLoggedIn, runQuery, sandboxId]);

  const entities = data?.sandbox?.customTemplate?.bookmarked || [];

  const config = (entity: number = 0) => {
    const bookmarked = entities;

    if (bookmarked[entity]) {
      bookmarked[entity].isBookmarked = !bookmarked[entity].isBookmarked;
    }

    return {
      variables: {
        template: customTemplate.id,
        ...(entity ? { team: entities[entity].id } : {}),
      },
      optimisticResponse: {
        __typename: 'Mutation',
        template: {
          __typename: 'Template',
          id: customTemplate.id,
          bookmarked,
        },
      },
      update: (proxy: any, { data: { template } }) => {
        const result = proxy.readQuery({
          query: getSandboxInfo,
          variables: { id: sandboxId },
        });
        proxy.writeQuery({
          query: getSandboxInfo,
          variables: { id: sandboxId },
          data: {
            sandbox: {
              ...result.sandbox,
              customTemplate: {
                ...result.sandbox.customTemplate,
                bookmarked: template.bookmarked,
              },
            },
          },
        });
      },
    };
  };

  const [follow] = useMutation<any, any>(bookmarkTemplate, config());
  const [unfollow] = useMutation<any, any>(unbookmarkTemplate, config());

  const handleToggleFollow = (i: number = 0) =>
    entities[i].isBookmarked ? unfollow(config(i)) : follow(config(i));

  return (
    <ButtonContainer css={style}>
      <MultiAction
        block
        small
        disabled={loading}
        onPrimaryClick={() => handleToggleFollow()}
        primaryActionLabel={
          entities[0] && entities[0].isBookmarked
            ? `Unbookmark Template`
            : `Bookmark Template`
        }
      >
        {entities.map(({ entity: { name } }, i: number) => (
          <button
            type="button"
            key={name}
            onClick={(e, menu) => {
              handleToggleFollow(i);
              menu.hide();
            }}
          >
            <ButtonIcon>
              {entities[i].isBookmarked ? <Checked /> : <Unchecked />}
            </ButtonIcon>
            {i === 0 ? 'My Bookmarks' : name}
          </button>
        ))}
      </MultiAction>
    </ButtonContainer>
  );
};
