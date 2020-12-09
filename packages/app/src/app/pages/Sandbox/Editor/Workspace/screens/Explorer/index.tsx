import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Dependencies } from './Dependencies';
import { ExternalResources } from './ExternalResources';
import { Files } from './Files';

type Props = {
  readonly?: boolean;
};

export const Explorer: FunctionComponent<Props> = ({ readonly = false }) => {
  const {
    state: {
      editor: {
        currentSandbox: { template },
      },
    },
  } = useOvermind();

  return (
    <>
      <Files readonly={readonly} />

      {template !== 'static' ? (
        <>
          <Dependencies readonly={readonly} />
          <ExternalResources readonly={readonly} />
        </>
      ) : null}
    </>
  );
};
