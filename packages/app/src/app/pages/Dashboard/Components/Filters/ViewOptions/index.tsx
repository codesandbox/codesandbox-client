import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Text, Menu, Stack } from '@codesandbox/components';
import { GridIcon, ListIcon } from './icons';

const STATES: { name: string; key: 'grid' | 'list'; icon: any }[] = [
  {
    name: 'Grid View',
    key: 'grid',
    icon: GridIcon,
  },
  {
    name: 'List View',
    key: 'list',
    icon: ListIcon,
  },
];

export const ViewOptions: FunctionComponent = React.memo(() => {
  const {
    actions: {
      dashboard: { viewModeChanged },
    },
    state: {
      dashboard: { viewMode },
    },
  } = useOvermind();

  return (
    <Menu>
        <Menu.Button>
          {viewMode === 'grid' ? <GridIcon /> : <ListIcon />}
        </Menu.Button>
        <Menu.List>
          {STATES.map(viewState => (
            <Menu.Item
              key={viewState.key}
              field={viewState.key}
              onSelect={() => viewModeChanged({ mode: viewState.key })}
            >
              <Stack gap={4} align="center" justify="space-between">
                <Text variant={viewMode === viewState.key ? 'body' : 'muted'}>
                  {viewState.name}
                </Text>
                {viewState.icon({
                  width: 10,
                  active: viewMode === viewState.key,
                })}
              </Stack>
            </Menu.Item>
          ))}
        </Menu.List>
      </Menu>
  );
});
