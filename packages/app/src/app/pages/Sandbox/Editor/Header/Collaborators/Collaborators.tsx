import React, { FunctionComponent } from 'react';
import css from '@styled-system/css';
import { Button, Element } from '@codesandbox/components';
import { Overlay } from 'app/components/Overlay';
import { AnimatePresence, motion } from 'framer-motion';

import { useOvermind } from 'app/overmind';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { AddPeople } from './icons';
import { Container, HorizontalSeparator } from './elements';
import { AddCollaboratorForm } from './AddCollaboratorForm';
import { Collaborator, Invitation, LinkPermissions } from './Collaborator';
import { ChangeLinkPermissionForm } from './ChangeLinkPermissionForm';

const Animated = props => (
  <motion.div
    animate={{ opacity: 1, height: 'auto' }}
    initial={{ opacity: 0, height: 0 }}
    exit={{ opacity: 0, height: 0 }}
    style={{ width: '100%', overflow: 'hidden' }}
    positionTransition
    css={css({ marginBottom: 4 })}
    {...props}
  />
);

const CollaboratorContent = () => {
  const { state } = useOvermind();

  const canEdit = hasPermission(
    state.editor.currentSandbox.authorization,
    'owner'
  );

  return (
    <Container paddingY={4} gap={4} direction="vertical">
      <Element paddingX={4}>
        <AddCollaboratorForm />
      </Element>

      <HorizontalSeparator />

      <Element paddingX={4} css={css({ height: 250, overflowY: 'auto' })}>
        <LinkPermissions />

        <HorizontalSeparator margin={4} />

        <AnimatePresence>
          {state.editor.collaborators.map(collaborator => (
            <Animated>
              <Collaborator
                key={collaborator.user.username}
                userId={collaborator.user.id}
                username={collaborator.user.username}
                avatarUrl={collaborator.user.avatarUrl}
                authorization={collaborator.authorization}
                lastSeenAt={collaborator.lastSeenAt}
                readOnly={!canEdit}
              />
            </Animated>
          ))}

          {state.editor.invitations.map(invitation => (
            <Animated>
              <Invitation
                key={invitation.email}
                email={invitation.email}
                id={invitation.id}
                authorization={invitation.authorization}
              />
            </Animated>
          ))}
        </AnimatePresence>
      </Element>

      <HorizontalSeparator />

      <Element paddingX={4}>
        <ChangeLinkPermissionForm />
      </Element>
    </Container>
  );
};

export const Collaborators: FunctionComponent = () => (
  <>
    <Overlay
      noHeightAnimation={false}
      event="Collaborators"
      content={CollaboratorContent}
    >
      {open => (
        <Button onClick={() => open()} variant="link">
          <AddPeople width={24} height={24} />
        </Button>
      )}
    </Overlay>
  </>
);
