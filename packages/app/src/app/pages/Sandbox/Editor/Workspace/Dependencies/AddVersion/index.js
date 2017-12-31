import React from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/Button';

import { ButtonContainer } from './elements';

function AddVersion({ store, signals }) {
  return (
    <div style={{ position: 'relative' }}>
      <ButtonContainer>
        <Button
          disabled={store.workspace.isProcessingDependencies}
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

export default inject('signals', 'store')(observer(AddVersion));
