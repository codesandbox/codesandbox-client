import React from 'react';
import { Icon } from '.';
import { SidebarRow, Text, Stack } from '../..';
import * as icons from './icons';

export default {
  title: 'components/Icon',
  component: Icon,
};

export const Simple = () => (
  <Stack gap={2}>
    <Icon name="github" />
    <Icon name="github" css={{ color: 'blues.500' }} />
    <Icon name="github" size={24} />
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
        {/* 
        // @ts-ignore you would only do this in a story, never in the app */}
        <Icon name={name} />
        <Text size={2} variant="muted">
          {name}
        </Text>
      </Stack>
    ))}
  </Stack>
);
