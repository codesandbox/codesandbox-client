import React from 'react';
import { Icon, IconNames } from '.';
import { SidebarRow, Text, Stack } from '../..';
import * as icons from './icons';
import * as iconsNewStyle from './icons-new-style';

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

export const OldVsNewStyle = () => (
  <Stack direction="vertical" gap={2}>
    <Text>
      The old style (left) icons are fitted into a 16x16 grid. The new style
      icons (right) are exported with their proportional bounding boxes at
      16x16, so they align visually with the font size.
    </Text>
    <Stack gap={2}>
      <Icon name="github" size={32} css={{ border: '1px solid red' }} />
      <Icon name="folder" size={32} css={{ border: '1px solid red' }} />
    </Stack>
  </Stack>
);

export const List = () => (
  <Stack css={{ flexWrap: 'wrap' }}>
    {Object.keys(icons).map((name: IconNames) => (
      <Stack
        key={name}
        direction="vertical"
        align="center"
        gap={2}
        css={{ width: 64, margin: 4 }}
      >
        <Icon name={name} />
        <Text size={2} variant="muted">
          {name}
        </Text>
      </Stack>
    ))}
  </Stack>
);

export const ListNewStyle = () => (
  <Stack css={{ flexWrap: 'wrap' }}>
    {Object.keys(iconsNewStyle).map((name: IconNames) => (
      <Stack
        key={name}
        direction="vertical"
        align="center"
        gap={1}
        css={{ width: 64, margin: 4, marginRight: 0 }}
      >
        <Icon name={name} size={24} />
        <Text size={2} variant="muted">
          {name}
        </Text>
      </Stack>
    ))}
  </Stack>
);
