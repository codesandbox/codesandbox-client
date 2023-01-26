import React from 'react';
import {
  Badge,
  formatNumber,
  Icon,
  Stack,
  Text,
} from '@codesandbox/components';
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
  forks?: number;
  isOfficial?: boolean;
}

export const TemplateCard = ({
  disabled,
  template,
  onSelectTemplate,
  onOpenTemplate,
  padding,
  forks,
  isOfficial,
}: TemplateCardProps) => {
  const { isLoggedIn } = useAppState();
  const { UserIcon } = getTemplateIcon(
    template.sandbox.title,
    template.iconUrl,
    template.sandbox?.source?.template
  );

  const sandboxTitle = template.sandbox?.title || template.sandbox?.alias;
  const isV2 = template.sandbox?.isV2;

  const teamName =
    template.sandbox?.team?.name ||
    template.sandbox?.author?.username ||
    'GitHub';

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
          {isOfficial && <Badge>Official</Badge>}
          {!isOfficial && isV2 && <Badge icon="cloud">Beta</Badge>}
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

          <Stack justify="space-between" css={{ color: '#999', width: '100%' }}>
            <Text truncate size={2} css={{ flex: 1 }}>
              <VisuallyHidden>by </VisuallyHidden>
              {isOfficial ? 'CodeSandbox' : teamName}
            </Text>
            {forks ? (
              <Stack gap={1} align="center">
                <Icon size={12} name="fork" />
                <Text size={2}>{formatNumber(forks)}</Text>
              </Stack>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </TemplateButton>
  );
};
