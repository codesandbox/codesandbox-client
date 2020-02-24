import { Button } from '@codesandbox/common/lib/components/Button';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { ButtonContainer, Container } from './elements';

export const AddVersion: FunctionComponent = ({ children }) => {
  const {
    actions: { modalOpened },
  } = useOvermind();

  return (
    <Container>
      <ButtonContainer>
        <Button
          block
          onClick={() => modalOpened({ modal: 'searchDependencies' })}
          small
        >
          {children}
        </Button>
      </ButtonContainer>
    </Container>
  );
};
