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

  const boxIcon = isDevbox ? 'boxDevbox' : 'boxSandbox';
  let boxTypeColor = isDevbox ? '#FFFFFF' : '#A6A6A6';
  let boxTypeLabel = isDevbox ? 'Devbox' : 'Sandbox';

  if (isRestricted) {
    boxTypeColor = '#F7CC66';
    boxTypeLabel = 'Restricted';
  }

  if (isTemplate) {
    boxTypeLabel += ' template';
  }

  return (
    <Stack align="center" gap={1}>
      <Icon name={boxIcon} color={boxTypeColor} />
      <Text size={2} color={boxTypeColor}>
        {boxTypeLabel}
      </Text>
    </Stack>
  );
};
