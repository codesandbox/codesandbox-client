import React from 'react';
import { Text, Stack } from '@codesandbox/components';

export const ContentSection: React.FC<{ title: string }> = ({
  title,
  children,
}) => (
  <Stack direction="vertical" gap={6}>
    <Text
      as="h2"
      css={{
        fontWeight: 400,
        fontSize: '24px',
        letterSpacing: '-0.019em',
        color: '#FFFFFF',
        margin: 0,
      }}
    >
      {title}
    </Text>
    {children}
  </Stack>
);
