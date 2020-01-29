import React from 'react';
import { useOvermind } from 'app/overmind';
import { Files } from './Files';
import { Dependencies } from './Dependencies';
import { ExternalResources } from './ExternalResources';

export const Explorer = ({ filesDefaultOpen = true }) => {
  const {
    state: { editor },
  } = useOvermind();

  const template = editor.currentSandbox.template;

  return (
    <>
      <Files defaultOpen={filesDefaultOpen} />
      {template !== 'static' && (
        <>
          <Dependencies />
          <ExternalResources />
        </>
      )}
    </>
  );
};
