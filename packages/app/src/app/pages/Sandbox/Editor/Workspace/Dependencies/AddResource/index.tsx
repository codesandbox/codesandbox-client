import { Button } from '@codesandbox/common/lib/components/Button';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';

import { useOvermind } from 'app/overmind';

import { WorkspaceInputContainer } from '../../elements';

import { ButtonContainer, Container } from './elements';

export const AddResource: FunctionComponent = () => {
  const {
    actions: {
      workspace: { externalResourceAdded },
    },
  } = useOvermind();
  const [name, setName] = useState('');

  const addResource = async () => {
    if (name) {
      await externalResourceAdded(name.trim());

      setName('');
    }
  };
  const changeName = ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
    setName(value);
  const handleKeyUp = ({ keyCode }: KeyboardEvent<HTMLInputElement>) => {
    if (keyCode === ENTER) {
      addResource();
    }
  };

  return (
    <Container>
      <WorkspaceInputContainer>
        <input
          onChange={changeName}
          onKeyUp={handleKeyUp}
          placeholder="https://cdn.com/bootstrap.css"
          value={name}
        />
      </WorkspaceInputContainer>

      <ButtonContainer>
        <Button block disabled={name === ''} onClick={addResource} small>
          Add Resource
        </Button>
      </ButtonContainer>
    </Container>
  );
};
