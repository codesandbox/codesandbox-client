import React, { FunctionComponent } from 'react';
import { Button } from '@codesandbox/components';
import { Overlay } from 'app/components/Overlay';

import { AddPeople } from './icons';
import { UserSearchInput } from './UserSearchInput';
import { Container } from './elements';

const CollaboratorContent = () => (
  <Container>
    <UserSearchInput />
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
