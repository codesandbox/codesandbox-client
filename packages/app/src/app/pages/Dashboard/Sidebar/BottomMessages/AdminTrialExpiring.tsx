import React from 'react';
import { Stack, Text } from '@codesandbox/components';

export const AdminTrialExpiring: React.FC<{ daysLeft: number }> = ({
  daysLeft,
}) => (
  <Stack align="flex-start" direction="vertical" gap={2}>
    <Text css={{ color: '#c2c2c2', fontWeight: 500, fontSize: 12 }}>
      {daysLeft === 0 && <>Your trial expires today.</>}
      {daysLeft === 1 && <>Your trial expires tomorrow.</>}
      {daysLeft > 1 && <>{daysLeft} days left on your trial.</>}
    </Text>
    <Text css={{ color: '#999', fontWeight: 400, fontSize: 12 }}>
      After this period, your Team Pro subscription will be automatically
      renewed.
    </Text>
  </Stack>
);
