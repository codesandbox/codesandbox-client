import React, { FunctionComponent } from 'react';
import { Button } from '@codesandbox/components';
import { Overlay } from 'app/components/Overlay';

import { AddPeople } from './icons';
import { Container } from './elements';
import { AddCollaboratorForm } from './AddCollaboratorForm';

const CollaboratorContent = () => (
  <Container direction="vertical">
    <AddCollaboratorForm />
  </Container>
);

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
