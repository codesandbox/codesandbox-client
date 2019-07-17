import React from 'react';

import { useSignals } from 'app/store';

import { Action } from '../../../../elements';

export const AliasDeploymentButton = ({ deploy: { alias, uid: id } }) => {
  const {
    deployment: { aliasDeployment },
  } = useSignals();

  return (
    <Action disabled={alias.length > 0} onClick={() => aliasDeployment({ id })}>
      {alias.length > 0 ? 'Aliased' : 'Alias'}
    </Action>
  );
};
