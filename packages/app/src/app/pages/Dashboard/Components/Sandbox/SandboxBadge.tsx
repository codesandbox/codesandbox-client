import { Icon, Stack, Text } from '@codesandbox/components';
import { SandboxFragmentDashboardFragment as Sandbox } from 'app/graphql/types';
import React from 'react';

export interface SandboxBadgeProps {
  sandbox: Sandbox;
  restricted: boolean;
}

export const SandboxBadge: React.FC<SandboxBadgeProps> = ({
  sandbox,
  restricted,
}) => {
  const isDevbox = sandbox.isV2;
  const isRestricted = restricted;
  const isTemplate = !!sandbox.customTemplate;

  const boxIcon = isDevbox ? 'server' : 'boxDevbox';
  let boxTypeLabel = isDevbox ? 'Devbox' : 'Sandbox';

  if (isTemplate) {
    boxTypeLabel = 'Template';
  }

  if (isRestricted) {
    boxTypeLabel += ' (Restricted)';
  }

  return (
    <Stack align="center" gap={1}>
      <Icon name={boxIcon} color="#A6A6A6" />
      <Text size={2} color="#A6A6A6">
        {boxTypeLabel}
      </Text>
    </Stack>
  );
};
