import { Icon, Stack, Text } from '@codesandbox/components';
import React from 'react';

export interface SandboxBadgeProps {
  isDevbox: boolean;
  isTemplate: boolean;
  restricted: boolean;
}

export const SandboxBadge: React.FC<SandboxBadgeProps> = ({
  isDevbox,
  isTemplate,
  restricted,
}) => {
  const boxIcon = isDevbox ? 'boxDevbox' : 'boxSandbox';
  let boxTypeColor = isDevbox ? '#FFFFFF' : '#A6A6A6';
  let boxTypeLabel = isDevbox ? 'Devbox' : 'Sandbox';

  if (restricted) {
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
