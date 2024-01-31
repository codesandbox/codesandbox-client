import React from 'react';
import { Text, Stack } from '@codesandbox/components';
import { useActions } from 'app/overmind';
import { TemplateFragment } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { TemplateCard } from './TemplateCard';
import {
  DevboxAlternative,
  SandboxAlternative,
  TemplateGrid,
} from './elements';

interface TemplateListProps {
  title: string;
  showEmptyState?: boolean;
  searchQuery?: string;
  type: 'sandbox' | 'devbox';
  templates: TemplateFragment[];
  onSelectTemplate: (template: TemplateFragment) => void;
  onOpenTemplate: (template: TemplateFragment) => void;
}

export const TemplateList = ({
  title,
  templates,
  onSelectTemplate,
  onOpenTemplate,
  showEmptyState = false,
  searchQuery,
  type,
}: TemplateListProps) => {
  const actions = useActions();

  return (
    <Stack direction="vertical" css={{ height: '100%' }} gap={4}>
      <Stack align="center" gap={2}>
        <Text
          as="h2"
          size={4}
          css={{
            fontWeight: 500,
            lineHeight: '24px',
            margin: 0,
          }}
        >
          {showEmptyState && templates.length === 0 ? 'No results' : title}
        </Text>
      </Stack>

      {templates.length > 0 && (
        <TemplateGrid>
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelectTemplate={onSelectTemplate}
              onOpenTemplate={onOpenTemplate}
            />
          ))}
        </TemplateGrid>
      )}

      {showEmptyState && searchQuery && templates.length === 0 && (
        <Stack
          direction="vertical"
          align="center"
          gap={2}
          css={{ width: '100%', padding: '24px', background: '#2a2a2a' }}
        >
          <Text size={4} weight="600">
            Not finding what you need?
          </Text>
          <Text size={3} css={{ width: '300px', textAlign: 'center' }}>
            {type === 'devbox' ? (
              <DevboxAlternative
                searchQuery={searchQuery}
                onClick={() => {
                  track(`Create ${type} - Open Community Search`, {
                    codesandbox: 'V1',
                    event_source: 'UI - Empty Template List',
                  });
                }}
              />
            ) : (
              <SandboxAlternative
                onClick={() => {
                  track(`Create ${type} - Open Devboxes`, {
                    codesandbox: 'V1',
                    event_source: 'UI - Empty Template List',
                  });
                  actions.modalOpened({
                    modal: 'createDevbox',
                  });
                }}
              />
            )}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};
