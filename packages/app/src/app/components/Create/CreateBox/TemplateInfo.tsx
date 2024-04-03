import { Stack, Text, Icon } from '@codesandbox/components';
import { formatNumber } from '@codesandbox/components/lib/components/Stats';
import React from 'react';
import { SandboxToFork } from '../utils/types';
import { TemplateIcon } from '../TemplateIcon';

interface TemplateInfoProps {
  template: SandboxToFork;
}

export const TemplateInfo = ({ template }: TemplateInfoProps) => {
  const title = template.title || template.alias;
  const owner = template.author;

  return (
    <Stack direction="vertical" gap={4}>
      <TemplateIcon template={template} />
      <Stack direction="vertical" gap={1}>
        <Text size={3} weight="500">
          {title}
        </Text>
        {owner && (
          <Text size={3} css={{ color: '#999' }}>
            {owner}
          </Text>
        )}
      </Stack>
      <Text size={3} css={{ color: '#999', lineHeight: '1.4' }}>
        {template.description}
      </Text>
      <Stack gap={3} css={{ color: '#999' }}>
        <Stack gap={1}>
          <Icon name="eye" size={14} />
          <Text size={2}>{formatNumber(template.viewCount)}</Text>
        </Stack>
        <Stack gap={1}>
          <Icon name="fork" size={14} />
          <Text size={2}>{formatNumber(template.forkCount)}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
