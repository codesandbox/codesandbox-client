import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { TemplateGrid } from '../../elements';
import { TemplateCard } from '../../TemplateCard';
import { SandboxToFork } from '../../utils/types';

export const StartFromTemplate = () => {
  const { officialTemplates } = useAppState();

  const starterTemplates = officialTemplates.filter(t =>
    t.tags.includes('starter')
  );

  const handleTemplateSelect = (template: SandboxToFork) => {
    window.location.href = template.editorUrl + '?createRepo=true';
  };

  return (
    <Stack direction="vertical" gap={4}>
      <Text size={3}>
        Create a new repository from one of our starter templates
      </Text>
      <TemplateGrid>
        {starterTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelectTemplate={handleTemplateSelect}
            onOpenTemplate={handleTemplateSelect}
          />
        ))}
      </TemplateGrid>
    </Stack>
  );
};
