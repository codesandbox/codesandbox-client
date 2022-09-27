import React, { useEffect } from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Text, Stack } from '@codesandbox/components';

import { TemplateFragment } from 'app/graphql/types';
import { TemplateCard } from './TemplateCard';
import { TemplateGrid } from './elements';

interface TemplateCategoryListProps {
  title: string;
  templates: TemplateFragment[];
  onSelectTemplate: (template: TemplateFragment) => void;
}

export const TemplateCategoryList = ({
  title,
  templates,
  onSelectTemplate,
}: TemplateCategoryListProps) => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: title });
  }, [title]);

  return (
    <Stack direction="vertical" gap={6}>
      <Text
        as="h2"
        size={4}
        css={{
          fontWeight: 500,
          lineHeight: 1.5,
          margin: 0,
          marginTop: 4,
        }}
      >
        {title}
      </Text>
      <TemplateGrid>
        {templates.length > 0 ? (
          templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelectTemplate={onSelectTemplate}
            />
          ))
        ) : (
          <div>No templates for this category.</div>
        )}
      </TemplateGrid>
    </Stack>
  );
};
