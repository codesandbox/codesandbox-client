import React from 'react';
import { Badge, Stack, Text } from '@codesandbox/components';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { TemplateFragment } from 'app/graphql/types';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { useAppState } from 'app/overmind';
import { TemplateButton } from './elements';

interface TemplateCardProps {
  disabled?: boolean;
  template: TemplateFragment;
  onSelectTemplate: (template: TemplateFragment) => void;
  onOpenTemplate: (template: TemplateFragment) => void;
  padding?: number | string;
}

export const TemplateCard = ({
  disabled,
  template,
  onSelectTemplate,
  onOpenTemplate,
  padding,
}: TemplateCardProps) => {
  const { isLoggedIn } = useAppState();
  const { UserIcon } = getTemplateIcon(
    template.sandbox.title,
    template.iconUrl,
    template.sandbox?.source?.template
  );

  const sandboxTitle = template.sandbox?.title || template.sandbox?.alias;
  const isV2 = template.sandbox?.isV2;
  const teamName = template.sandbox?.collection?.team?.name;

  return (
    <TemplateButton
      title={sandboxTitle}
      css={{ padding }}
      type="button"
      onClick={evt => {
        if (disabled) {
          return;
        }

        if (evt.metaKey || evt.ctrlKey || !isLoggedIn) {
          onOpenTemplate(template);
        } else {
          onSelectTemplate(template);
        }
      }}
      onKeyDown={evt => {
        if (disabled) {
          return;
        }

        if (evt.key === 'Enter') {
          evt.preventDefault();
          if (evt.metaKey || evt.ctrlKey) {
            onOpenTemplate(template);
          } else {
            onSelectTemplate(template);
          }
        }
      }}
      disabled={disabled}
    >
      <Stack
        css={{ height: '100%', width: '100%' }}
        direction="vertical"
        justify="space-between"
        gap={4}
      >
        <Stack
          css={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <UserIcon height="20" width="20" />
          {isV2 && <Badge icon="cloud">Beta</Badge>}
        </Stack>
        <Stack direction="vertical" gap={1}>
          <Text
            css={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
            size={13}
            lineHeight="16px"
            weight="500"
          >
            {sandboxTitle}
          </Text>

          <Text size={2} css={{ color: '#999' }}>
            <VisuallyHidden>by </VisuallyHidden>
            {teamName || 'GitHub'}
          </Text>
        </Stack>
      </Stack>
    </TemplateButton>
  );
};
