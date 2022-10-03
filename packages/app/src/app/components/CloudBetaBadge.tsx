import React from 'react';
import { Icon, Stack, Text } from '@codesandbox/components';

export const CloudBetaBadge: React.FC<{ hideIcon?: boolean }> = ({
  hideIcon,
}) => (
  <Stack
    css={{
      alignItems: 'center',
      padding: hideIcon ? '3px 10px' : '6px 10px',
      background: '#2e2e2e',
      borderRadius: '999px',
    }}
    gap={2}
  >
    {!hideIcon && <Icon size={12} name="cloud" />}
    <Text size={1}>Beta</Text>
  </Stack>
);
