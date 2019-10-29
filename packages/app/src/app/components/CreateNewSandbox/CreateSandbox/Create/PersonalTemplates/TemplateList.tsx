import React from 'react';
import { SandboxCard } from '../../SandboxCard';
import { SubHeader, Grid } from '../elements';

// TODO: better typings
interface ITemplateListProps {
  templates: { sandbox?: unknown; id: string; template: unknown }[];
  title: string;
}

export const TemplateList = ({ templates, title }: ITemplateListProps) => (
  <>
    <SubHeader>{title}</SubHeader>
    <Grid>
      {templates.map(template => (
        <SandboxCard
          official={!template.sandbox}
          key={template.id}
          template={template}
        />
      ))}
    </Grid>
  </>
);
