import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Checked from 'react-icons/lib/md/check-box';
import Unchecked from 'react-icons/lib/md/check-box-outline-blank';
import { MultiAction } from '@codesandbox/common/lib/components/MultiAction';
import { useStore } from 'app/store';
import SignInButton from 'app/pages/common/SignInButton';
import Dependencies from '../../Dependencies';
import Files from '../../Files';
import { Project } from '../../Project';
import WorkspaceItem from '../../WorkspaceItem';
import { ButtonContainer, ButtonIcon } from './elements';
// @ts-ignore
import { followTemplate } from './mutations.gql';
// @ts-ignore
import { getSandboxInfo } from './queries.gql';

export const NotOwnedSandboxInfo = observer(() => {
  const [editActions, setEditActions] = useState(null); // eslint-disable-line
  const {
    isLoggedIn,
    editor: {
      currentId: sandboxId,
      currentSandbox: { customTemplate },
    },
  } = useStore();

  const [toggleFollow, { error, data: result }] = useMutation<any, any>( // eslint-disable-line
    followTemplate,
    {
      variables: { template: sandboxId },
    }
  );
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

  const handleToggleFollow = (team?: string) => {
    if (team) {
      toggleFollow({ variables: { team } });
    } else {
      toggleFollow();
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <Project />
      {customTemplate && (
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
              {entities.map(({ entity: { id, name } }, i: number) => (
                <button
                  key={name}
                  disabled={loading}
                  onClick={() => handleToggleFollow(id)}
                >
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
      )}
      <WorkspaceItem
        actions={editActions}
        defaultOpen
        style={{ marginTop: '.5rem' }}
        title="Files"
      >
        <Files setEditActions={setEditActions} />
      </WorkspaceItem>
      <WorkspaceItem
        defaultOpen
        style={{ marginTop: '.5rem' }}
        title="Dependencies"
      >
        <Dependencies />
      </WorkspaceItem>
    </div>
  );
});
