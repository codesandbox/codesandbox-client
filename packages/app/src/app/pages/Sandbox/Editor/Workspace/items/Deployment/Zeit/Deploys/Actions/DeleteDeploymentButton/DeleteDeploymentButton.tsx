import React, { FunctionComponent } from 'react';
import TrashIcon from 'react-icons/lib/fa/trash';

import { useOvermind } from 'app/overmind';

import { Action } from '../../../../elements';

type Props = {
  id: string;
};
export const DeleteDeploymentButton: FunctionComponent<Props> = ({ id }) => {
  const {
    actions: {
      deployment: { setDeploymentToDelete },
      modalOpened,
    },
    state: { deployment },
  } = useOvermind();

  return (
    <Action
      disabled={
        deployment.deploysBeingDeleted
          ? deployment.deploysBeingDeleted.includes(id)
          : deployment[`${id}Deleting`]
      }
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
};
