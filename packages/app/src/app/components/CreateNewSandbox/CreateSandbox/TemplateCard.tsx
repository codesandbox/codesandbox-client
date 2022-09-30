import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';

import { TemplateFragment } from 'app/graphql/types';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { TemplateButton } from './elements';
import { CloudBetaBadge } from './CloudBetaBadge';

interface TemplateCardProps {
  template: TemplateFragment;
  onSelectTemplate: (template: TemplateFragment) => void;
}

export const TemplateCard = ({
  template,
  onSelectTemplate,
}: TemplateCardProps) => {
  const { UserIcon } = getTemplateIcon(
    template.iconUrl,
    template.sandbox?.source?.template
  );

  const sandboxTitle = template.sandbox?.title;
  const isV2 = template.sandbox?.isV2;
  const teamName = template.sandbox?.collection?.team?.name;

  return (
    <TemplateButton type="button" onClick={() => onSelectTemplate(template)}>
      <Stack css={{ height: '100%' }} direction="vertical" gap={4}>
        <Stack
          css={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <UserIcon />
          {isV2 && <CloudBetaBadge />}
        </Stack>
        <Stack direction="vertical" gap={1}>
          <Text
            size={3}
            variant="body"
            css={{ fontWeight: 500, textOverflow: 'ellipsis' }}
          >
            {sandboxTitle}
          </Text>

          <Text size={2} css={{ color: '#808080' }}>
            <VisuallyHidden>by </VisuallyHidden>
            {teamName || 'CodeSandbox'}
          </Text>
        </Stack>
      </Stack>
    </TemplateButton>
  );
};
