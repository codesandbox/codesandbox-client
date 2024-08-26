import React from 'react';
import { formatNumber, Icon, Stack, Text } from '@codesandbox/components';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { TemplateButton } from './elements';
import { SandboxToFork } from './utils/types';
import { TemplateIcon } from './TemplateIcon';
import { CODEIUM_ID } from './utils/constants';

interface TemplateCardProps {
  disabled?: boolean;
  template: SandboxToFork;
  onSelectTemplate: (template: SandboxToFork) => void;
  onOpenTemplate: (template: SandboxToFork) => void;
  padding?: number | string;
  forks?: number;
}

export const TemplateCard = ({
  disabled,
  template,
  onSelectTemplate,
  onOpenTemplate,
  padding,
  forks,
}: TemplateCardProps) => {
  const sandboxTitle = template.title || template.alias;
  const teamName = template.id === CODEIUM_ID ? 'Codeium' : template.author;

  return (
    <TemplateButton
      title={sandboxTitle}
      style={{ padding }}
      type="button"
      onClick={evt => {
        if (disabled) {
          return;
        }

        if (evt.metaKey || evt.ctrlKey) {
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
          <TemplateIcon template={template} />
          <Stack gap={1} direction="horizontal">
            {(template.type === 'sandbox' || template.browserSandboxId) && (
              <Tooltip content="Runs on browser">
                <Stack css={{ width: 16, height: 16 }}>
                  <Icon
                    css={{ margin: 'auto' }}
                    color="#999"
                    size={14}
                    name="boxDevbox"
                  />
                </Stack>
              </Tooltip>
            )}
            {template.type === 'devbox' && (
              <Tooltip content="Runs on server">
                <Icon color="#999" size={16} name="server" />
              </Tooltip>
            )}
          </Stack>
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
              {teamName}
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
