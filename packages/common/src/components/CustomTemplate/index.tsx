import React from 'react';
import Tags from '../Tags';
import { Overlay, SandboxDescription } from '../SandboxCard/elements';
import {
  Border,
  TemplateTitle,
  TemplateSubTitle,
  MyTemplate,
} from './elements';
import { Sandbox } from '../../types';

interface Props {
  template?: {
    id: string;
    name: string;
    color: string;
    title: string;
    description: string;
    sandbox: Sandbox;
  };
  i: number;
  onClick?: () => void;
}
const BANNER = 'https://codesandbox.io/static/img/banner.png';
const CustomTemplate = ({ template, onClick, i }: Props) => {
  if (!template) {
    return (
      <MyTemplate key={i}>
        <img height="109px" alt="loading" src={BANNER} />
        <Border />
        <div>
          <TemplateTitle>Loading</TemplateTitle>
        </div>
      </MyTemplate>
    );
  }
  return (
    <MyTemplate key={i} onClick={onClick} overlayHeight={109}>
      <img
        height="109px"
        src={template.sandbox.screenshotUrl || BANNER}
        alt={template.title}
      />
      <Overlay>
        <SandboxDescription>{template.description}</SandboxDescription>
        {template.sandbox.tags && <Tags tags={template.sandbox.tags} />}
      </Overlay>
      <Border color={template.color} />
      <div>
        <TemplateTitle>{template.title}</TemplateTitle>
        <TemplateSubTitle>{template.description}</TemplateSubTitle>
      </div>
    </MyTemplate>
  );
};

export default CustomTemplate;
