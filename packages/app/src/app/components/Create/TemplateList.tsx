import React from 'react';
import { Text, Stack } from '@codesandbox/components';
import { TemplateCard } from './TemplateCard';
import { TemplateGrid } from './elements';
import { SandboxToFork } from './utils/types';

interface TemplateListProps {
  title?: string;
  templates: SandboxToFork[];
  onSelectTemplate: (template: SandboxToFork) => void;
  onOpenTemplate: (template: SandboxToFork) => void;
}

export const TemplateList = ({
  title,
  templates,
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
    </Stack>
  );
};
