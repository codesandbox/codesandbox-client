import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useStore } from 'app/store';
import SignInButton from 'app/pages/common/SignInButton';
import Checked from 'react-icons/lib/md/check-box';
import Unchecked from 'react-icons/lib/md/check-box-outline-blank';
import { MultiAction } from '@codesandbox/common/lib/components/MultiAction';
import { ButtonContainer, ButtonIcon } from './elements';
// @ts-ignore
import { followTemplate, unfollowTemplate } from './mutations.gql';
// @ts-ignore
import { getSandboxInfo } from './queries.gql';

export const FollowTemplateButton = observer(() => {
  const {
    isLoggedIn,
    editor: {
      currentId: sandboxId,
      currentSandbox: { customTemplate },
    },
  } = useStore();
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
      data.sandbox.customTemplate.following) ||
    [];

  const config = (entity: number = 0) => {
    const following = entities;

    if (following[entity]) {
      following[entity].isFollowing = !following[entity].isFollowing;
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
          following,
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
                following: template.following,
              },
            },
          },
        });
      },
    };
  };

  const [follow] = useMutation<any, any>(followTemplate, config());
  const [unfollow] = useMutation<any, any>(unfollowTemplate, config());

  const handleToggleFollow = (i: number = 0) =>
    entities[i].isFollowing ? unfollow(config(i)) : follow(config(i));

  return customTemplate ? (
    <ButtonContainer>
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
            entities[0] && entities[0].isFollowing
              ? `Unfollow Template`
              : `Follow Template`
          }
        >
          {entities.map(({ entity: { name } }, i: number) => (
            <button key={name} onClick={() => handleToggleFollow(i)}>
              <ButtonIcon>
                {entities[i].isFollowing ? <Checked /> : <Unchecked />}
              </ButtonIcon>
              {`${entities[i].isFollowing ? `Remove from` : `Add to`} ${
                i ? name : `my`
              } followed templates.`}
            </button>
          ))}
        </MultiAction>
      )}
    </ButtonContainer>
  ) : null;
});
