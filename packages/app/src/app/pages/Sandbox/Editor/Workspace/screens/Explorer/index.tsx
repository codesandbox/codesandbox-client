import React from 'react';
import { useOvermind } from 'app/overmind';
import { Files } from './Files';
import { Dependencies } from './Dependencies';
import { ExternalResources } from './ExternalResources';

export const Explorer = () => {
  const {
    state: { editor },
  } = useOvermind();

  const template = editor.currentSandbox.template;

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
