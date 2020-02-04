import { dispatch } from 'codesandbox-api';
import React, { FunctionComponent } from 'react';
import DownloadIcon from 'react-icons/lib/fa/download';
import FlaskIcon from 'react-icons/lib/fa/flask';
import BuildIcon from 'react-icons/lib/fa/wrench';
import NodeIcon from 'react-icons/lib/io/social-nodejs';

import { useOvermind } from 'app/overmind';

import { Task } from './elements';

const getIcon = (script: string) => {
  const iconsByScript = {
    install: DownloadIcon,
    lint: FlaskIcon,
    node: NodeIcon,
    test: FlaskIcon,
  };

  return iconsByScript[script] || BuildIcon;
};

// These scripts are only supposed to run on the main thread.
const blacklistedScripts = ['dev', 'develop', 'serve', 'start'];

export const Scripts: FunctionComponent = () => {
  const {
    state: {
      editor: { parsedConfigurations },
    },
  } = useOvermind();
  const { scripts } = parsedConfigurations?.package?.parsed || {};

  if (!scripts) {
    return null;
  }

  const runScript = (script: string) =>
    dispatch({ script, type: 'codesandbox:create-shell' });

  return (
    <div>
      {Object.keys(scripts)
        .filter(script => !blacklistedScripts.includes(script))
        .map(script => {
          const Icon = getIcon(script);

          return (
            <Task key={script} onClick={() => runScript(script)}>
              <Icon />

              {`yarn ${script}`}
            </Task>
          );
        })}

      <Task onClick={() => runScript('install')}>
        <DownloadIcon />

        {'yarn install'}
      </Task>

      <Task onClick={() => runScript('node')}>
        <NodeIcon />

        {'node'}
      </Task>
    </div>
  );
};
