import React from 'react';
import { ListTemplatesQuery } from 'app/graphql/types';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { SandboxCard } from '../../SandboxCard';
import { SubHeader, Grid } from '../elements';

// TODO: better typings
interface ITemplateListProps {
  templates: ListTemplatesQuery['me']['templates'];
  title: string;
}

export const TemplateList = ({ templates, title }: ITemplateListProps) => (
  <>
    <SubHeader>{title}</SubHeader>
    <Grid>
      {templates.map(template => (
        <SandboxCard
          key={template.id}
          title={template.sandbox.title}
          iconUrl={template.iconUrl}
          // @ts-ignore
          environment={template.sandbox.source.template}
          url={sandboxUrl(template.sandbox)}
          color={template.color}
          mine
          owner={template.sandbox.author.username}
          templateId={template.id}
          sandboxId={template.sandbox.id}
        />
      ))}
    </Grid>
  </>
);
