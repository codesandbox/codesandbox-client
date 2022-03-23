import React from 'react';

import css from '@styled-system/css';
import { Button, Stack, Text } from '@codesandbox/components';

import { Card } from '../../components';

export const Upgrade = () => {
  return (
    <Card style={{ backgroundColor: 'white' }}>
      <Stack direction="vertical" gap={4} css={css({ color: 'grays.800' })}>
        <Text size={6} weight="bold">
          Go Pro
        </Text>
        <Stack direction="vertical" gap={1}>
          <Text size={3}>+ Work in private</Text>
          <Text size={3}>+ More file storage</Text>
          <Text size={3}>+ Higher upload limits</Text>
          <Text size={3}>+ Flexible permissions</Text>
        </Stack>
        <Button as="a" href="/pro" marginTop={2}>
          Upgrade to Pro
        </Button>
      </Stack>
    </Card>
  );
};
