import React from 'react';
import { useOvermind } from 'app/overmind';
import { Stack, List, ListAction, Text } from '@codesandbox/components';
import css from '@styled-system/css';

export const SandboxPicker: React.FC = () => {
  const {
    state: {
      profile: { collections },
    },
    actions: {
      profile: { fetchCollections, getSandboxesByPath },
    },
  } = useOvermind();

  const [selectedPath, setPath] = React.useState('/');

  React.useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  React.useEffect(() => {
    getSandboxesByPath({ path: selectedPath });
  }, [selectedPath, getSandboxesByPath]);

  return (
    <Stack css={css({ backgroundColor: 'grays.800' })}>
      <Stack
        css={css({
          width: 240,
          borderRight: '1px solid',
          borderColor: 'grays.600',
          flexShrink: 0,
          paddingY: 4,
        })}
      >
        <List css={{ width: '100%' }}>
          {collections.map(collection => (
            <ListAction
              key={collection.path}
              align="center"
              css={css({ height: 10 })}
              onClick={() => setPath(collection.path)}
            >
              <Text>
                {collection.path === '/' ? 'All Sandboxes' : collection.path}
              </Text>
            </ListAction>
          ))}
        </List>
      </Stack>

      <ul>
        {collections
          .filter(collection => collection.path.startsWith(selectedPath))
          .filter(collection => collection.path !== selectedPath)
          .map(collection => (
            <li key={collection.path}>
              <button type="button" onClick={() => setPath(collection.path)}>
                {collection.path}
              </button>
            </li>
          ))}
      </ul>
      <ul>
        {collections
          .find(collection => collection.path === selectedPath)
          ?.sandboxes.map(sandbox => (
            <li key={sandbox.id}>{sandbox.title || sandbox.alias}</li>
          ))}
      </ul>
    </Stack>
  );
};
