import React from 'react';
import { inject } from 'mobx-react';

import Button from 'app/components/Button';

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

export default inject('signals')(AddVersion);
