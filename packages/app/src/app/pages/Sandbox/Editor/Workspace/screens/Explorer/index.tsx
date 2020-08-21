import { useOvermind } from 'app/overmind';
import React from 'react';

import { Dependencies } from './Dependencies';
import { ExternalResources } from './ExternalResources';
import { Files } from './Files';

export const Explorer: React.FC<{ readonly?: boolean }> = ({
  readonly = false,
}) => {
  const {
    state: { editor },
  } = useOvermind();

  const template = editor.currentSandbox.template;

  return (
    <>
      <Files readonly={readonly} />
      {template !== 'static' && (
        <>
          <Dependencies readonly={readonly} />
          <ExternalResources readonly={readonly} />
        </>
      )}
    </>
  );
};
