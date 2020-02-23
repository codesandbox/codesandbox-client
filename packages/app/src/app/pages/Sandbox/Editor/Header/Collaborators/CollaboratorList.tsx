import React from 'react';
import css from '@styled-system/css';
import { Element } from '@codesandbox/components';
import { AnimatePresence, motion } from 'framer-motion';

import { useOvermind } from 'app/overmind';
import { TeamIcon } from '@codesandbox/common/lib/components/icons/Team';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { Authorization } from 'app/graphql/types';
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
            permissionText="Can Access"
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
        {state.editor.collaborators.map(collaborator => (
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
