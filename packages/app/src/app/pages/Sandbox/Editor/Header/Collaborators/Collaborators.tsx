import React, { FunctionComponent } from 'react';
import css from '@styled-system/css';
import { Button } from '@codesandbox/components';
import { Overlay } from 'app/components/Overlay';
import { AnimatePresence } from 'framer-motion';

import { useOvermind } from 'app/overmind';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { AddPeople } from './icons';
import { Container, HorizontalSeparator } from './elements';
import { AddCollaboratorForm } from './AddCollaboratorForm';
import { Collaborator, Invitation, LinkPermissions } from './Collaborator';
import { ChangeLinkPermissionForm } from './ChangeLinkPermissionForm';

const CollaboratorContent = () => {
  const { state } = useOvermind();

  const canEdit = hasPermission(
    state.editor.currentSandbox.authorization,
    'owner'
  );

  return (
    <Container gap={4} direction="vertical">
      <AddCollaboratorForm />

      <HorizontalSeparator />

      <div css={css({ height: 250, overflowY: 'auto' })}>
        <LinkPermissions />
        <AnimatePresence>
          {state.editor.collaborators.map(collaborator => (
            <Collaborator
              key={collaborator.user.username}
              userId={collaborator.user.id}
              username={collaborator.user.username}
              avatarUrl={collaborator.user.avatarUrl}
              authorization={collaborator.authorization}
              lastSeenAt={collaborator.lastSeenAt}
              readOnly={!canEdit}
            />
          ))}

          {state.editor.invitations.map(invitation => (
            <Invitation
              key={invitation.email}
              email={invitation.email}
              id={invitation.id}
              authorization={invitation.authorization}
            />
          ))}
        </AnimatePresence>
      </div>

      <HorizontalSeparator />

      <ChangeLinkPermissionForm />
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
