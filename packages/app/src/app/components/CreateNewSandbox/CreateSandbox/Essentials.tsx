import track from '@codesandbox/common/lib/utils/analytics';
import { TemplateFragment } from 'app/graphql/types';
import React, { useEffect } from 'react';

interface EssentialsProps {
  title: string;
  templates: TemplateFragment[];
}

export const Essentials = ({ title, templates }: EssentialsProps) => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: title });
  }, [title]);

  const selectTemplate = (id: TemplateFragment['id']) => {
    console.log('id', id);
  };

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {templates.length > 0 ? (
          templates.map(template => (
            <button
              key={template.id}
              type="button"
              onClick={() => selectTemplate(template.id)}
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
