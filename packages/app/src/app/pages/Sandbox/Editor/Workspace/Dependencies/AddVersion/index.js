import React from 'react';
import { inject, observer } from 'mobx-react';

import Button from 'app/components/Button';

import { ButtonContainer } from './elements';

function AddVersion({ store, signals }) {
  return (
    <div style={{ position: 'relative' }}>
      <ButtonContainer>
        <Button
          disabled={store.editor.workspace.isProcessingDependencies}
          block
          small
          onClick={() =>
            signals.editor.workspace.searchDependenciesModalOpened()
          }
        >
          Add Package
        </Button>
      </ButtonContainer>
    </div>
  );
}

export default inject('signals', 'store')(observer(AddVersion));
