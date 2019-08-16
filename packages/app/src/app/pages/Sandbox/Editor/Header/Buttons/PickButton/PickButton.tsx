import React from 'react';
import { inject, hooksObserver } from 'app/componentConnectors';
import { Button } from './elements';

export const PickButton = inject('store', 'signals')(
  hooksObserver(
    ({
      signals: {
        explore: { pickSandboxModal },
      },
      store: {
        editor: {
          currentSandbox: { id, title, description, owned },
        },
      },
    }) => {
      const details = {
        id,
        title,
        description,
      };

      return (
        <Button
          onClick={() => {
            pickSandboxModal({ details });
          }}
          secondary={owned}
          small
        >
          Pick
        </Button>
      );
    }
  )
);
