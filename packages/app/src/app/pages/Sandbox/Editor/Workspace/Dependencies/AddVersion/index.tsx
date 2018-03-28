import * as React from 'react';
import { connect } from 'app/fluent';

import Button from 'app/components/Button';

import { ButtonContainer } from './elements';

export default connect()
  .with(({ signals }) => ({
    modalOpened: signals.modalOpened
  }))
  .to(
    function AddVersion({ modalOpened, children }) {
      return (
        <div style={{ position: 'relative' }}>
          <ButtonContainer>
            <Button
              block
              small
              onClick={() =>
                modalOpened({
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
  )
