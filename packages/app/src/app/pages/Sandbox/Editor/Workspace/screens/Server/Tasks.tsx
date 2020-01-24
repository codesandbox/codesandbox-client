import React from 'react';
import { dispatch } from 'codesandbox-api';

import BuildIcon from 'react-icons/lib/fa/wrench';
import FlaskIcon from 'react-icons/lib/fa/flask';
import DownloadIcon from 'react-icons/lib/fa/download';
import NodeIcon from 'react-icons/lib/io/social-nodejs';
import { List, ListAction, Text } from '@codesandbox/components';

type Props = {
  package?: {
    scripts?: {
      [command: string]: string;
    };
  };
};

// These scripts are only supposed to run on the main thread.
const blacklistedScripts = ['dev', 'develop', 'serve', 'start'];

const getIcon = (scriptName: string) => {
  switch (scriptName) {
    case 'test':
    case 'lint':
      return <FlaskIcon />;
    case 'node':
      return <NodeIcon />;
    case 'install':
      return <DownloadIcon />;
    default: {
      return <BuildIcon />;
    }
  }
};

export const Tasks = ({ package: pkg }: Props) => {
  const runTask = (task: string) => {
    dispatch({
      type: 'codesandbox:create-shell',
      script: task,
    });
  };
  if (!pkg?.scripts) {
    return null;
  }

  const commands = Object.keys(pkg.scripts).filter(
    x => !blacklistedScripts.includes(x)
  );
  return (
    <List>
      {commands.map(task => (
        <ListAction onClick={() => runTask(task)} key={task}>
          {getIcon(task)} <Text marginLeft={2}>yarn {task}</Text>
        </ListAction>
      ))}
      <ListAction onClick={() => runTask('install')}>
        {getIcon('install')} <Text marginLeft={2}>yarn install</Text>
      </ListAction>
      <ListAction onClick={() => runTask('node')}>
        {getIcon('node')} <Text marginLeft={2}>node</Text>
      </ListAction>
    </List>
  );
};
