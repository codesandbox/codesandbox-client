import React from 'react';
import { inject } from 'mobx-react';

import Button from 'app/components/Button';

import { ButtonContainer } from './elements';

function AddVersion({ signals }) {
  return (
    <div style={{ position: 'relative' }}>
      <ButtonContainer>
        <Button
          block
          small
          onClick={() => signals.workspace.searchDependenciesModalOpened()}
        >
          Add Package
        </Button>
      </ButtonContainer>
    </div>
  );
}

export default inject('signals')(AddVersion);
