import React from 'react';
import { useOvermind } from 'app/overmind';

import { Button } from '@codesandbox/common/lib/components/Button';

import { ButtonContainer } from './elements';

export const AddVersion: React.FC = ({ children }) => {
  const {
    actions: { modalOpened },
  } = useOvermind();
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
};
