import { List, ListAction, Text, Collapsible } from '@codesandbox/components';
import { dispatch } from 'codesandbox-api';
import React, { FunctionComponent } from 'react';
import DownloadIcon from 'react-icons/lib/fa/download';
import FlaskIcon from 'react-icons/lib/fa/flask';
import BuildIcon from 'react-icons/lib/fa/wrench';
import NodeIcon from 'react-icons/lib/io/social-nodejs';

import { useAppState } from 'app/overmind';

// These scripts are only supposed to run on the main thread.
const blacklistedScripts = ['dev', 'develop', 'serve', 'start'];

const getIcon = (script: string) => {
  const iconsByScript = {
    install: DownloadIcon,
    lint: FlaskIcon,
    node: NodeIcon,
    test: FlaskIcon,
  };

  return iconsByScript[script] || BuildIcon;
};

export const Tasks: FunctionComponent = () => {
  const { parsedConfigurations: pkg } = useAppState().editor;

  if (!pkg?.scripts) {
    return null;
  }

  const runTask = (script: string) =>
    dispatch({ script, type: 'codesandbox:create-shell' });
  return (
    <Collapsible defaultOpen title="Run Script">
      <List>
        {Object.keys(pkg.scripts)
          .filter(script => !blacklistedScripts.includes(script))
          .map(script => {
            const Icon = getIcon(script);

            return (
              <ListAction key={script} onClick={() => runTask(script)}>
                <Icon />

                <Text marginLeft={2}>yarn {script}</Text>
              </ListAction>
            );
          })}

        <ListAction onClick={() => runTask('install')}>
          <DownloadIcon />

          <Text marginLeft={2}>yarn install</Text>
        </ListAction>

        <ListAction onClick={() => runTask('node')}>
          <NodeIcon />

          <Text marginLeft={2}>node</Text>
        </ListAction>
      </List>
    </Collapsible>
  );
};
