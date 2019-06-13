import React, { useState } from 'react';
import { Button } from '@codesandbox/common/lib/components/Button';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { useSignals } from 'app/store';
import { WorkspaceInputContainer } from '../elements';
import { Container, ButtonContainer } from './elements';

export const AddExternalResource = () => {
  const [name, setName] = useState(``);
  const {
    workspace: { externalResourceAdded },
  } = useSignals();

  const handleSetName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleAddResource = async () => {
    if (name) {
      await externalResourceAdded({ resource: name.trim() });
      setName(``);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ENTER) {
      handleAddResource();
    }
  };

  return (
    <Container>
      <WorkspaceInputContainer>
        <input
          placeholder="https://cdn.com/bootstrap.css"
          value={name}
          onChange={handleSetName}
          onKeyUp={handleKeyUp}
        />
      </WorkspaceInputContainer>
      <ButtonContainer>
        <Button disabled={name === ''} block small onClick={handleAddResource}>
          Add Resource
        </Button>
      </ButtonContainer>
    </Container>
  );
};
