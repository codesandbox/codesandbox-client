import React from 'react';
import { Text, Stack } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { TemplateCard } from './TemplateCard';
import { DevboxAlternative, TemplateGrid } from './elements';
import { SandboxToFork } from './utils/types';

interface TemplateListProps {
  title?: string;
  searchQuery: string;
  templates: SandboxToFork[];
  onSelectTemplate: (template: SandboxToFork) => void;
  onOpenTemplate: (template: SandboxToFork) => void;
}

export const TemplateList = ({
  title,
  templates,
  searchQuery,
  onSelectTemplate,
  onOpenTemplate,
}: TemplateListProps) => {
  return (
    <Stack direction="vertical" css={{ height: '100%' }} gap={3}>
      <Stack align="center" gap={2}>
        <Text
          as="h2"
          size={3}
          variant="muted"
          css={{
            fontWeight: 500,
            lineHeight: '24px',
            margin: 0,
          }}
        >
          {templates.length === 0 ? 'No results' : title}
        </Text>
      </Stack>

      {templates.length > 0 && (
        <TemplateGrid>
          {templates.map(template => (
            <TemplateCard
              key={template.id + template.browserSandboxId + template.title}
              template={template}
              onSelectTemplate={onSelectTemplate}
              onOpenTemplate={onOpenTemplate}
              forks={template.forkCount}
            />
          ))}
        </TemplateGrid>
      )}

      {searchQuery && templates.length === 0 && (
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
            <DevboxAlternative
              searchQuery={searchQuery}
              onClick={() => {
                track(`Create - Open Community Search`);
              }}
            />
          </Text>
        </Stack>
      )}
    </Stack>
  );
};
