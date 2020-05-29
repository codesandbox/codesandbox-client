import { TeamIcon } from '@codesandbox/common/es/components/icons/Team';
import { RoomInfo } from '@codesandbox/common/es/types';
import { hasPermission } from '@codesandbox/common/es/utils/permission';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { Authorization } from 'app/graphql/types';
import { useOvermind } from 'app/overmind';
import { AnimatePresence, motion } from 'framer-motion';
import { sortBy } from 'lodash-es';
import React from 'react';

import { Collaborator, CollaboratorItem, Invitation } from './Collaborator';

const Animated = ({ showMountAnimations, ...props }) => (
  <motion.div
    animate={{ opacity: 1, height: 'auto' }}
    initial={showMountAnimations ? { opacity: 0, height: 0 } : null}
    exit={{ opacity: 0, height: 0 }}
    style={{ width: '100%', overflow: 'hidden' }}
    positionTransition
  >
    <Element
      css={css({
        marginTop: 4,
      })}
      {...props}
    />
  </motion.div>
);

function getLiveUser(currentUserId: string, roomInfo: RoomInfo) {
  return roomInfo?.users?.find(u => u.userId === currentUserId);
}

export const CollaboratorList = () => {
  const { state } = useOvermind();

  const [showMountAnimations, setShowMountAnimations] = React.useState(false);

  React.useEffect(() => {
    setShowMountAnimations(true);
  }, [setShowMountAnimations]);

  const isOwner = hasPermission(
    state.editor.currentSandbox.authorization,
    'owner'
  );
  const { author, team } = state.editor.currentSandbox;

  const collaboratorsConnectedWithLive = state.editor.collaborators.map(
    collaborator => {
      const currentLiveUser = getLiveUser(
        collaborator.user.id,
        state.live?.roomInfo
      );
      if (currentLiveUser) {
        return { ...collaborator, lastSeenAt: Infinity };
      }

      return collaborator;
    }
  );

  const sortedCollaborators = sortBy(collaboratorsConnectedWithLive, c => [
    -(c.lastSeenAt === Infinity
      ? new Date().getTime()
      : new Date(c.lastSeenAt || 0).getTime()),
    c.user.username,
  ]);

  return (
    <Element
      paddingX={4}
      css={css({
        maxHeight: 250,
        minHeight: 100,
        overflowY: 'auto',
        paddingBottom: 4,
      })}
    >
      {team && (
        <Animated showMountAnimations={showMountAnimations}>
          <CollaboratorItem
            name={team.name}
            avatarComponent={<TeamIcon width={24} height={24} />}
            authorization={Authorization.Owner}
            permissions={[]}
            permissionText="Owner"
          />
        </Animated>
      )}

      <Animated showMountAnimations={showMountAnimations}>
        <CollaboratorItem
          name={author.username}
          avatarUrl={author.avatarUrl}
          authorization={Authorization.Owner}
          permissions={[]}
          permissionText="Owner"
        />
      </Animated>

      <AnimatePresence>
        {sortedCollaborators.map(collaborator => (
          <Animated
            showMountAnimations={showMountAnimations}
            key={collaborator.user.username}
          >
            <Collaborator
              userId={collaborator.user.id}
              username={collaborator.user.username}
              avatarUrl={collaborator.user.avatarUrl}
              authorization={collaborator.authorization}
              lastSeenAt={collaborator.lastSeenAt}
              isViewingNow={collaborator.lastSeenAt === Infinity}
              warning={collaborator.warning}
              readOnly={!isOwner}
            />
          </Animated>
        ))}

        {state.editor.invitations.map(invitation => (
          <Animated
            showMountAnimations={showMountAnimations}
            key={invitation.email}
          >
            <Invitation
              email={invitation.email}
              id={invitation.id}
              authorization={invitation.authorization}
            />
          </Animated>
        ))}
      </AnimatePresence>
    </Element>
  );
};
