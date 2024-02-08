import React, { FunctionComponent } from 'react';
import { useActions, useAppState } from 'app/overmind';
import { Text, Menu, Stack, IconButton } from '@codesandbox/components';

const FIELD_TO_NAME = {
  insertedAt: 'Last Created',
  updatedAt: 'Last Modified',
  title: 'Name',
  views: 'Views',
};

export const SortOptions: FunctionComponent = React.memo(() => {
  const {
    dashboard: {
      orderBy: { field, order },
    },
  } = useAppState();
  const {
    dashboard: { orderByChanged },
  } = useActions();
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
          <Text>{FIELD_TO_NAME[field]}</Text>
        </Menu.Button>
        <IconButton
          name="arrowDown"
          size={11}
          variant="square"
          title="Reverse sort direction"
          onClick={toggleSort}
          css={{ transform: `rotate(${order === 'desc' ? 0 : 180}deg)` }}
        />
      </Stack>
      <Menu.List>
        {Object.keys(FIELD_TO_NAME).map(key => (
          <Menu.Item field="title" key={key} onSelect={() => setField(key)}>
            <Text>{FIELD_TO_NAME[key]}</Text>
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );
});
