import React from 'react';
import { useOvermind } from 'app/overmind';
import { ZeitDeployment } from '@codesandbox/common/lib/types';
import { Action } from '../../../../elements';

type Props = {
  deploy: ZeitDeployment;
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
