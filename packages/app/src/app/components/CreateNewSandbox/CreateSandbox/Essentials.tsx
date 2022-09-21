import track from '@codesandbox/common/lib/utils/analytics';
import { TemplateFragment } from 'app/graphql/types';
import React, { useEffect } from 'react';

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
      <h2>{title}</h2>
      <div>
        {templates.length > 0 ? (
          templates.map(template => (
            <button
              key={template.id}
              type="button"
              onClick={() => selectTemplate(template)}
            >
              {template.sandbox.title}
            </button>
          ))
        ) : (
          <div>No templates for this category.</div>
        )}
      </div>
    </div>
  );
};
