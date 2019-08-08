import React from 'react';

import { Action } from '../../../../elements';

import { Deploy } from '../types';
import { inject } from 'app/componentConnectors';

type Props = {
  deploy: Deploy;
};
export const AliasDeploymentButton = inject('signals')(
  ({
    deploy: { alias: aliases, uid: id },
    signals: {
      deployment: { aliasDeployment },
    },
  }: Props & { signals: any }) => (
    <Action
      disabled={aliases.length > 0}
      onClick={() => aliasDeployment({ id })}
    >
      {aliases.length > 0 ? 'Aliased' : 'Alias'}
    </Action>
  )
);
