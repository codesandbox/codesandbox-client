import React from 'react';
import { inject } from 'mobx-react';

import Button from 'app/components/Button';

import { ButtonContainer } from './elements';
import Relative from 'common/components/Relative';

function AddVersion({ signals, children }) {
  return (
    <Relative>
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
    </Relative>
  );
}

export default inject('signals')(AddVersion);
