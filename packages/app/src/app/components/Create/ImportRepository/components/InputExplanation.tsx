import React from 'react';
import { Stack, Icon, Text } from '@codesandbox/components';

export const InputExplanation: React.FC<{ variant: 'info' | 'error' }> = ({
  children,
  variant = 'info',
}) => {
  const COLOR_MAP = {
    info: '#A8BFFA',
    error: '#F5A8A8',
  };

  return (
    <Stack gap={1} css={{ color: COLOR_MAP[variant], alignItems: 'center' }}>
      <Icon name="circleBang" />
      <Text size={3}>
        {children}
      </Text>
    </Stack>
  );
};
