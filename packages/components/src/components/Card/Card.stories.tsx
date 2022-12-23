import React from 'react';
import styled from 'styled-components';
import { Card } from './Card';
import { Stack } from '../Stack';
import { Icon } from '../Icon';
import { Text } from '../Text';

export default {
  title: 'components/Card',
  component: Card,
};

const CardRow = styled.div`
  box-sizing: border-box;
  display: grid;
  margin: 32px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: 16px;
  height: 154px;
`;

export const Default = () => (
  <CardRow>
    <Card>Import Repository</Card>
    <Card>Import Repository</Card>
    <Card>Import Repository</Card>
  </CardRow>
);

export const TwoSlots = () => (
  <CardRow>
    <Card>
      <Stack
        css={{ height: '100%' }}
        direction="vertical"
        justify="space-between"
      >
        <Icon size={16} name="branch" />
        <Text>Create branch</Text>
      </Stack>
    </Card>
  </CardRow>
);
