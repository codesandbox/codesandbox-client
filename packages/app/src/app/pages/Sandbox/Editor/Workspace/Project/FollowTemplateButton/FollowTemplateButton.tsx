import React, { useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useOvermind } from 'app/overmind';
import { SignInButton } from 'app/pages/common/SignInButton';
import Checked from 'react-icons/lib/md/check-box';
import Unchecked from 'react-icons/lib/md/check-box-outline-blank';
import { MultiAction } from '@codesandbox/common/lib/components/MultiAction';
import { ButtonContainer, ButtonIcon } from './elements';
// @ts-ignore
import { bookmarkTemplate, unbookmarkTemplate } from './mutations.gql';
// @ts-ignore
import { getSandboxInfo } from './queries.gql';

export const FollowTemplateButton = ({ style }) => {
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

  const entities =
    (data &&
      data.sandbox &&
      data.sandbox.customTemplate &&
      data.sandbox.customTemplate.bookmarked) ||
    [];

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

  return customTemplate ? (
    <ButtonContainer css={style}>
      {!isLoggedIn ? (
        <>
          You need to be signed in to follow templates.
          <SignInButton block />
        </>
      ) : (
        <MultiAction
          block
          small
          disabled={loading}
          onPrimaryClick={() => handleToggleFollow()}
          primaryActionLabel={
            entities[0] && entities[0].isBookmarked
              ? `Unfollow Template`
              : `Follow Template`
          }
        >
          {entities.map(({ entity: { name } }, i: number) => (
            <button
              type="button"
              key={name}
              onClick={() => handleToggleFollow(i)}
            >
              <ButtonIcon>
                {entities[i].isBookmarked ? <Checked /> : <Unchecked />}
              </ButtonIcon>
              {`${entities[i].isBookmarked ? `Remove from` : `Add to`} ${
                i ? name : `my`
              } followed templates.`}
            </button>
          ))}
        </MultiAction>
      )}
    </ButtonContainer>
  ) : null;
};
