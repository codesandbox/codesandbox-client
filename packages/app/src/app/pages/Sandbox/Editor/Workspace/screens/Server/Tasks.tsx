import { Collapsible, List, ListAction, Text } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { dispatch } from 'codesandbox-api';
import React from 'react';
import { FaDownload, FaFlask, FaWrench } from 'react-icons/fa';
import { IoLogoNodejs } from 'react-icons/io';

// These scripts are only supposed to run on the main thread.
const blacklistedScripts = ['dev', 'develop', 'serve', 'start'];

const getIcon = (scriptName: string) => {
  switch (scriptName) {
    case 'test':
    case 'lint':
      return <FaFlask />;
    case 'node':
      return <IoLogoNodejs />;
    case 'install':
      return <FaDownload />;
    default: {
      return <FaWrench />;
    }
  }
};

export const Tasks = () => {
  const {
    state: {
      editor: { parsedConfigurations: pkg },
    },
  } = useOvermind();

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
    <Collapsible title="Run Script" defaultOpen>
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
    </Collapsible>
  );
};
