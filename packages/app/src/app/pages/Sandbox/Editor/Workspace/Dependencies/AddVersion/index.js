import React from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';

import { Button } from '@codesandbox/common/lib/components/Button';

import { ButtonContainer } from './elements';

function AddVersion({ signals, children }) {
  return (
    <div style={{ position: 'relative' }}>
      <ButtonContainer>
        <Button
          block
          small
          onClick={() =>
            signals.modalOpened({
              modal: 'searchDependencies',
            })
          }
        >
          {children}
        </Button>
      </ButtonContainer>
    </div>
  );
}

export default inject('signals')(hooksObserver(AddVersion));
