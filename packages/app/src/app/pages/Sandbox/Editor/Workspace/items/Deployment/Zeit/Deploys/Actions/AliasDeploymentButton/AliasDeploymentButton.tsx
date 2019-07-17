import React from 'react';

import { useSignals } from 'app/store';

import { Action } from '../../../../elements';

import { Deploy } from '../types';

type Props = {
  deploy: Deploy;
};
export const AliasDeploymentButton = ({
  deploy: { alias: aliases, uid: id },
}: Props) => {
  const {
    deployment: { aliasDeployment },
  } = useSignals();

  return (
    <Action
      disabled={aliases.length > 0}
      onClick={() => aliasDeployment({ id })}
    >
      {aliases.length > 0 ? 'Aliased' : 'Alias'}
    </Action>
  );
};
