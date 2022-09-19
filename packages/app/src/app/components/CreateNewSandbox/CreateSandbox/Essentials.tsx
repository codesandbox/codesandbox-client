import track from '@codesandbox/common/lib/utils/analytics';
import { TemplateFragment } from 'app/graphql/types';
import React, { useEffect } from 'react';

interface EssentialsProps {
  title: string;
  templates: TemplateFragment[];
  requestTemplates: () => void;
}

export const Essentials = ({
  title,
  templates,
  requestTemplates,
}: EssentialsProps) => {
  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: title });
  }, [title]);

  if (templates.length === 0) {
    // TODO: check if templates have tried loading before
    // TODO: check if templates have an error

    requestTemplates();
  }

  return (
    <div>
      <h2>{title}</h2>
      <div>
        {templates.map(template => (
          <div key={template.id}>{template.sandbox.title}</div>
        ))}
      </div>
    </div>
  );
};
