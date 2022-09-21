import React, { useEffect } from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Element } from '@codesandbox/components';

import { TemplateFragment } from 'app/graphql/types';
import { TemplateCard } from './TemplateCard';
import { TemplateGrid } from './elements';

interface EssentialsProps {
  title: string;
  templates: TemplateFragment[];
  selectTemplate: (template: TemplateFragment) => void;
}

export const Essentials = ({
  title,
  templates,
  selectTemplate,
}: EssentialsProps) => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: title });
  }, [title]);

  return (
    <div>
      <Element as="h2" css={{ margin: 0 }}>
        {title}
      </Element>
      <TemplateGrid>
        {templates.length > 0 ? (
          templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              selectTemplate={selectTemplate}
            />
          ))
        ) : (
          <div>No templates for this category.</div>
        )}
      </TemplateGrid>
    </div>
  );
};
