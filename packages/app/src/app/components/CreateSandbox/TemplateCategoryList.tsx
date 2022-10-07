import React, { useEffect } from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Text, Stack } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { CloudBetaBadge } from 'app/components/CloudBetaBadge';
import { TemplateFragment } from 'app/graphql/types';
import { TemplateCard } from './TemplateCard';
import { TemplateGrid } from './elements';

interface TemplateCategoryListProps {
  title: string;
  showBetaTag?: boolean;
  templates: TemplateFragment[];
  onSelectTemplate: (template: TemplateFragment) => void;
  onOpenTemplate: (template: TemplateFragment) => void;
}

export const TemplateCategoryList = ({
  title,
  showBetaTag,
  templates,
  onSelectTemplate,
  onOpenTemplate,
}: TemplateCategoryListProps) => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: title });
  }, [title]);

  return (
    <Stack direction="vertical" css={{ height: '100%' }} gap={6}>
      <Stack
        css={css({
          alignItems: 'center',
          '@media screen and (max-width: 950px)': {
            display: 'none',
          },
        })}
        gap={2}
      >
        <Text
          as="h2"
          size={4}
          css={{
            fontWeight: 500,
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {title}
        </Text>
        {showBetaTag && <CloudBetaBadge hideIcon />}
      </Stack>
      <TemplateGrid>
        {templates.length > 0 ? (
          templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelectTemplate={onSelectTemplate}
              onOpenTemplate={onOpenTemplate}
            />
          ))
        ) : (
          <div>No templates for this category.</div>
        )}
      </TemplateGrid>
    </Stack>
  );
};
