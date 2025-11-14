import { Icon, Stack, Text } from '@codesandbox/components';
import React from 'react';

export interface SandboxBadgeProps {
  isSandboxV2: boolean;
  isSandboxTemplate: boolean;
  isSandboxRestricted: boolean;
}

export const SandboxBadge: React.FC<SandboxBadgeProps> = ({
  isSandboxV2,
  isSandboxTemplate,
  isSandboxRestricted,
}) => {
  const isDevbox = isSandboxV2;
  const isRestricted = isSandboxRestricted;
  const isTemplate = isSandboxTemplate;

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
