import React from 'react';
import { Stack, Text, Icon, Button } from '@codesandbox/components';
import css from '@styled-system/css';

export const PaymentSuccess = () => (
  <Stack
    direction="vertical"
    justify="center"
    align="center"
    css={css({
      fontSize: 3,
      width: 560,
      marginTop: 120,
      marginX: 'auto',
      textAlign: 'center',
    })}
  >
    <Icon name="simpleCheck" color="#5DCC67" size={64} />
    <Text as="h1" size={8}>
      Your Payment was Successful
    </Text>
    <Stack direction="vertical" align="center" gap={10}>
      <Text variant="muted" size={4}>
        We have emailed you the details of your order.
      </Text>
      <Button
        as="a"
        href="/dashboard/settings"
        style={{ fontSize: 13, height: 40 }}
      >
        Go to Dashboard
      </Button>
    </Stack>
  </Stack>
);
