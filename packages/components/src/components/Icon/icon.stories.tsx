import React, { ComponentProps } from 'react';

import { SidebarRow, Stack, Text } from '../..';

import { Icon } from '.';
import * as icons from './icons';

export default {
  title: 'components/Icon',
  component: Icon,
};

export const Simple = () => (
  <Stack gap={2}>
    <Icon name="github" />

    <Icon name="github" css={{ color: 'blues.500' }} />

    <Icon name="github" size={6} />
  </Stack>
);

export const Comments = () => (
  <SidebarRow justify="space-between" paddingX={4}>
    <Text>Comments</Text>

    <Icon name="filter" />
  </SidebarRow>
);

export const List = () => (
  <Stack css={{ flexWrap: 'wrap' }}>
    {Object.keys(icons).map(name => (
      <Stack
        key={name}
        direction="vertical"
        align="center"
        gap={2}
        css={{ width: 64, margin: 4 }}
      >
        <Icon name={name as ComponentProps<typeof Icon>['name']} />

        <Text size={2} variant="muted">
          {name}
        </Text>
      </Stack>
    ))}
  </Stack>
);
