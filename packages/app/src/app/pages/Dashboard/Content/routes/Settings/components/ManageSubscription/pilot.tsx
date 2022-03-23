import React from 'react';
import { Stack, Text, Link } from '@codesandbox/components';

import css from '@styled-system/css';

export const Pilot = () => {
  return (
    <Stack direction="vertical" gap={2}>
      <Text size={3} variant="muted">
        Pilot
      </Text>
      <Link
        size={3}
        variant="active"
        href="/pro"
        target="_blank"
        css={css({ fontWeight: 'medium' })}
      >
        Upgrade to Team Pro
      </Link>
    </Stack>
  );
};
