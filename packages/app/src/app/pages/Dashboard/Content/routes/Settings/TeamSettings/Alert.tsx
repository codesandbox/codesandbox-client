import React from 'react';
import { Icon, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';

interface AlertProps {
  message: string;
}

export const Alert = (props: AlertProps) => (
  <Stack
    css={css({
      backgroundColor: 'grays.600',
      borderRadius: 'medium',
      height: 9,
      paddingLeft: 2,
    })}
    gap={4}
    align="center"
  >
    <Icon size={24} name="info" />
    <Text color="white" weight="medium" size={2}>
      {props.message}
    </Text>
  </Stack>
);
