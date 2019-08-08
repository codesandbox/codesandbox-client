import { inject, hooksObserver } from 'app/componentConnectors';
import React from 'react';
import TrashIcon from 'react-icons/lib/fa/trash';

import { Action } from '../../../../elements';

type Props = {
  id: string;
  store: any;
  signals: any;
};
export const DeleteDeploymentButton = inject('store', 'signals')(
  hooksObserver(
    ({
      id,
      signals: {
        deployment: { setDeploymentToDelete },
        modalOpened,
      },
      store: { deployment },
    }: Props) => (
      <Action
        disabled={deployment[`${id}Deleting`]}
        onClick={() => {
          setDeploymentToDelete({ id });
          modalOpened({ modal: 'deleteDeployment' });
        }}
      >
        {deployment[`${id}Deleting`] ? (
          'Deleting'
        ) : (
          <>
            <TrashIcon /> <span>Delete</span>
          </>
        )}
      </Action>
    )
  )
);
