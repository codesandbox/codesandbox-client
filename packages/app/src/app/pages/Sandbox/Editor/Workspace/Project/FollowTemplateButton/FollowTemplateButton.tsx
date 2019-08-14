import React from 'react';
import { observer } from 'mobx-react-lite';
import { useQuery, useMutation } from '@apollo/react-hooks';
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

  const [follow] = useMutation<any, any>(followTemplate, {
    // eslint-disable-line
    variables: { template: customTemplate.id },
  });
  const [unfollow] = useMutation<any, any>(unfollowTemplate, {
    variables: { template: customTemplate.id },
  });
  const { loading, data } = useQuery(getSandboxInfo, {
    variables: { id: sandboxId || `` },
  });
  const entities =
    (data &&
      data.sandbox &&
      data.sandbox.customTemplate &&
      data.sandbox.customTemplate.following) ||
    [];
  const isFollowing = (i: number) =>
    (entities[i] && entities[i].isFollowing) || false;
  const isOwner = (
    i: number // eslint-disable-line
  ) => (entities[i] && entities[i].isFollowing) || false;

  const handleToggleFollow = (i: number = 0) => {
    console.log(entities[i].isFollowing);
    console.log(`Is entity following template: ${isFollowing[i]}`); // eslint-disable-line
    if (i > 0) {
      if (isFollowing[i]) {
        unfollow({
          variables: { template: customTemplate.id, team: entities[i].id },
        });
      } else {
        console.log(`Following template for team: ${entities[i].name}`); // eslint-disable-line
        follow({
          variables: { template: customTemplate.id, team: entities[i].id },
        });
      }
    } else if (isFollowing[i]) {
      console.log(`Unfollowed Template`); // eslint-disable-line
      unfollow();
    } else {
      follow();
    }
  };

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
            isFollowing(0) ? `Unfollow Template` : `Follow Template`
          }
        >
          {entities.map(({ entity: { name } }, i: number) => (
            <button key={name} onClick={() => handleToggleFollow(i)}>
              <ButtonIcon>
                {isFollowing(i) ? <Checked /> : <Unchecked />}
              </ButtonIcon>
              {`${
                isFollowing(i) ? `Remove from` : `Add to`
              } ${name} followed templates.`}
            </button>
          ))}
        </MultiAction>
      )}
    </ButtonContainer>
  ) : null;
});
