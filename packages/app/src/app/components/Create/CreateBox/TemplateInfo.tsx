import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { Stack, Text, Icon } from '@codesandbox/components';
import { formatNumber } from '@codesandbox/components/lib/components/Stats';
import { TemplateFragment } from 'app/graphql/types';
import React from 'react';

interface TemplateInfoProps {
  template: TemplateFragment;
}

export const TemplateInfo = ({ template }: TemplateInfoProps) => {
  const { UserIcon } = getTemplateIcon(
    template.sandbox.title,
    template.iconUrl,
    template.sandbox?.source?.template
  );

  const title = template.sandbox.title || template.sandbox.alias;
  const author =
    template.sandbox?.team?.name ||
    template.sandbox?.author?.username ||
    'CodeSandbox';

  return (
    <Stack direction="vertical" gap={4}>
      <UserIcon />
      <Stack direction="vertical" gap={1}>
        <Text size={3} weight="500">
          {title}
        </Text>
        {author && (
          <Text size={3} css={{ color: '#999' }}>
            {author}
          </Text>
        )}
      </Stack>
      <Text size={3} css={{ color: '#999', lineHeight: '1.4' }}>
        {template.sandbox.description}
      </Text>
      <Stack gap={3} horizontal css={{ color: '#999' }}>
        <Stack gap={1}>
          <Icon name="eye" size={14} />
          <Text size={2}>{formatNumber(template.sandbox.viewCount)}</Text>
        </Stack>
        <Stack gap={1}>
          <Icon name="fork" size={14} />
          <Text size={2}>{formatNumber(template.sandbox.forkCount)}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
