import React from 'react';
import { Button } from '@codesandbox/common/lib/components/Button';
import { useSignals } from 'app/store';
import { Container, ButtonContainer } from './elements';

export const AddNpmDependency = ({ children }) => {
  const { modalOpened } = useSignals();

  return (
    <Container>
      <ButtonContainer>
        <Button
          block
          small
          onClick={() => modalOpened({ modal: `searchDependencies` })}
        >
          {children}
        </Button>
      </ButtonContainer>
    </Container>
  );
};
