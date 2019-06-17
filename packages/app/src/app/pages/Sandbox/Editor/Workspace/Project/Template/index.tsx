import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { WorkspaceSubtitle } from '../../elements';

import { useSignals } from 'app/store';

import {
  TemplateTitle,
  TemplateDescription,
  Container,
  TemplateButton,
} from './elements';

type Props = {
  template: {
    title: string;
    description: string;
    color: string;
  };
};

const TemplateComponent = ({ template }: Props) => {
  const { modalOpened } = useSignals();

  return (
    <Container>
      <WorkspaceSubtitle
        style={{
          paddingLeft: 0,
        }}
      >
        Template Configuration
      </WorkspaceSubtitle>
      {template ? (
        <>
          <TemplateTitle color={template.color}>{template.title}</TemplateTitle>
          <TemplateDescription>{template.description}</TemplateDescription>
        </>
      ) : null}

      <TemplateButton
        block
        onClick={() => {
          modalOpened({ modal: 'template' });
        }}
      >
        {template ? 'Edit Template' : 'Make Template'}
      </TemplateButton>
    </Container>
  );
};

export default observer(TemplateComponent);
