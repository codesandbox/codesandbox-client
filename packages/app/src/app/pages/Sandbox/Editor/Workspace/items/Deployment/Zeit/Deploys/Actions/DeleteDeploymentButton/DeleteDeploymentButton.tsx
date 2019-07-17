import { observer } from 'mobx-react-lite';
import React from 'react';
import TrashIcon from 'react-icons/lib/fa/trash';

import { useSignals, useStore } from 'app/store';

import { Action } from '../../../../elements';

export const DeleteDeploymentButton = observer(({ id }) => {
  const {
    deployment: { setDeploymentToDelete },
    modalOpened,
  } = useSignals();
  const { deployment } = useStore();

  return (
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
  );
});
