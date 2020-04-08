import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Dependencies } from './Dependencies';
import { ExternalResources } from './ExternalResources';
import { Files } from './Files';

export const Explorer: FunctionComponent = () => {
  const {
    state: {
      editor: {
        currentSandbox: { template },
      },
    },
  } = useOvermind();

  return (
    <>
      <Files />

      {template !== 'static' && (
        <>
          <Dependencies />

          <ExternalResources />
        </>
      )}
    </>
  );
};
