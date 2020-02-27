import React from 'react';
import { Icon } from '.';
import { Stack } from '../Stack';
import { Text } from '../Text';
import * as icons from './icons';

export default {
  title: 'components/Icon',
  component: Icon,
};

export const Simple = () => (
  <>
    <Icon name="edit" />
    <Icon name="edit" css={{ color: 'green' }} />
    <Icon name="edit" size={24} />
  </>
);

export const List = () => (
  <Stack css={{ flexWrap: 'wrap' }}>
    {Object.keys(icons).map(name => (
      <Stack direction="vertical" align="center" css={{ width: 64, margin: 4 }}>
        <Icon name={name} />
        <Text size={2} variant="muted">
          {name}
        </Text>
      </Stack>
    ))}
  </Stack>
);
