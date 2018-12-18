import React from 'react';
import { inject } from 'mobx-react';

import Relative from 'common/components/Relative';
import Button from 'app/components/Button';

import { ButtonContainer } from './elements';

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
