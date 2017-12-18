import React from 'react';
import { inject, observer } from 'mobx-react';
import styled from 'styled-components';
import Modal from 'app/components/Modal';

import Button from 'app/components/buttons/Button';
import SearchDependencies from './SearchDependencies';

const ButtonContainer = styled.div`
  margin: 0.5rem 1rem;
`;

function AddVersion({ store, signals }) {
  return (
    <div style={{ position: 'relative' }}>
      <ButtonContainer>
        <Button
          disabled={store.editor.workspace.isProcessingDependencies}
          block
          small
          onClick={() => signals.editor.workspace.showSearchDependenciesModal()}
        >
          Add Package
        </Button>
      </ButtonContainer>
      <Modal
        isOpen={store.editor.workspace.showSearchDependenciesModal}
        width={600}
        onClose={() => signals.editor.workspace.hideSearchDependenciesModal()}
      >
        <SearchDependencies
          onConfirm={(name, version) =>
            signals.editor.workspace.npmDependencyAdded({ name, version })
          }
        />
      </Modal>
    </div>
  );
}

export default inject('signals', 'store')(observer(AddVersion));
