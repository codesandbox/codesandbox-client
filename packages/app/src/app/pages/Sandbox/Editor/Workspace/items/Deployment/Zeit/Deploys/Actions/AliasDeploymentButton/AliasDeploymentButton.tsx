import React from 'react';
import { useOvermind } from 'app/overmind';
import { Action } from '../../../../elements';
import { Deploy } from '../types';

type Props = {
  deploy: Deploy;
};

export const AliasDeploymentButton: React.FC<Props> = ({
  deploy: { alias: aliases, uid: id },
}) => {
  const {
    actions: {
      deployment: { aliasDeployment },
    },
  } = useOvermind();
  return (
    <Action
      disabled={aliases.length > 0}
      onClick={() => aliasDeployment({ id })}
    >
      {aliases.length > 0 ? 'Aliased' : 'Alias'}
    </Action>
  );
};
