import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Text, Menu, Stack, IconButton } from '@codesandbox/components';

const FIELD_TO_NAME = {
  insertedAt: 'Last Created',
  updatedAt: 'Last Modified',
  title: 'Name',
  views: 'Views',
};

export const SortOptions: FunctionComponent = React.memo(() => {
  const {
    actions: {
      dashboard: { orderByChanged },
    },
    state: {
      dashboard: {
        orderBy: { field, order },
      },
    },
  } = useOvermind();

  const toggleSort = () => {
    orderByChanged({
      field,
      order: order === 'asc' ? 'desc' : 'asc',
    });
  };

  const setField = (f: string) => orderByChanged({ field: f, order });

  return (
    <Menu>
      <Stack align="center">
        <Menu.Button>
          <Text variant="muted">{FIELD_TO_NAME[field]}</Text>
        </Menu.Button>
        <IconButton
          name="arrowDown"
          size={11}
          title="Reverse sort direction"
          onClick={toggleSort}
          css={{ transform: `rotate(${order === 'desc' ? 0 : 180}deg)` }}
        />
      </Stack>
      <Menu.List>
        {Object.keys(FIELD_TO_NAME).map(key => (
          <Menu.Item field="title" key={key} onSelect={() => setField(key)}>
            <Text variant={FIELD_TO_NAME[key] === field ? 'body' : 'muted'}>
              {FIELD_TO_NAME[key]}
            </Text>
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );
});
