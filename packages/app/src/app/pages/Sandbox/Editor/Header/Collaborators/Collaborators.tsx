import React, { FunctionComponent } from 'react';
import { Button, Stack } from '@codesandbox/components';
import { Overlay } from 'app/components/Overlay';
import { AnimatePresence } from 'framer-motion';

import { useOvermind } from 'app/overmind';
import { AddPeople } from './icons';
import { Container } from './elements';
import { AddCollaboratorForm } from './AddCollaboratorForm';
import { Collaborator, Invitation } from './Collaborator';

const CollaboratorContent = () => {
  const { state } = useOvermind();

  return (
    <Container gap={4} direction="vertical">
      <AddCollaboratorForm />

      <div>
        <AnimatePresence>
          {state.editor.collaborators.map(collaborator => (
            <Collaborator
              key={collaborator.user.username}
              username={collaborator.user.username}
              avatarUrl={collaborator.user.avatarUrl}
              authorization={collaborator.authorization}
              lastSeenAt={collaborator.lastSeenAt}
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
