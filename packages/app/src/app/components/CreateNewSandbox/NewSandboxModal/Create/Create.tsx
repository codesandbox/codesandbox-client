import React from 'react';
import { SandboxCard } from '../SandboxCard';
import { GridList } from '../GridList';
import { Header } from '../elements';
import { Subheader } from './elements';
import { all } from '../availableTemplates';

export const Create = () => (
  <>
    <Header>
      <span>Create Sandbox</span>
    </Header>
    <Subheader>Official Templates</Subheader>
    <GridList aria-label="Official Templates">
      {all.map(template => (
        <SandboxCard official key={template.niceName} {...template} />
      ))}
    </GridList>
  </>
);
