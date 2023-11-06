import React from 'react';
import css from '@styled-system/css';
import { Element } from '@codesandbox/components';
import { AnimatePresence, motion } from 'framer-motion';

import { useAppState } from 'app/overmind';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { Authorization } from 'app/graphql/types';
import { sortBy } from 'lodash-es';
import { RoomInfo } from '@codesandbox/common/lib/types';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { CollaboratorItem, Collaborator, Invitation } from './Collaborator';

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
  const { editor, live } = useAppState();

  const [showMountAnimations, setShowMountAnimations] = React.useState(false);

  React.useEffect(() => {
    setShowMountAnimations(true);
  }, [setShowMountAnimations]);

  const isOwner = hasPermission(editor.currentSandbox.authorization, 'owner');
  const { author, team } = editor.currentSandbox;

  const collaboratorsConnectedWithLive = editor.collaborators.map(
    collaborator => {
      const currentLiveUser = getLiveUser(collaborator.user.id, live?.roomInfo);
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
      <Animated showMountAnimations={showMountAnimations}>
        <CollaboratorItem
          name={team.name}
          avatarComponent={
            <TeamAvatar
              style={{ width: '100%', height: '100%', borderWidth: 0 }}
              name={team.name}
              avatar={team.avatarUrl}
            />
          }
          authorization={Authorization.Owner}
          permissions={[]}
          permissionText="Can edit"
          subtext="All workspace members"
        />
      </Animated>

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

        {editor.invitations.map(invitation => (
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
