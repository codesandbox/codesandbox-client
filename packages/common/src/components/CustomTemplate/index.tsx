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
import { getSandboxName } from '../../utils/get-sandbox-name';

interface Props {
  template?: {
    id: string;
    color: string;
    sandbox: Sandbox;
  };
  i: number;
  onClick?: () => void;
}
const BANNER = 'https://codesandbox.io/static/img/banner.png';
const SCREENSHOT_API_URL = (id: string) =>
  `https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png`;
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

  const sandbox = template.sandbox;
  const title = getSandboxName(sandbox);

  return (
    <MyTemplate key={i} onClick={onClick} overlayHeight={109}>
      <img
        height="109px"
        src={
          process.env.NODE_ENV === 'development'
            ? BANNER
            : SCREENSHOT_API_URL(sandbox.id) || BANNER
        }
        alt={title}
      />
      <Overlay>
        <SandboxDescription>{sandbox.description}</SandboxDescription>
        {sandbox.tags && <Tags tags={sandbox.tags} />}
      </Overlay>
      <Border color={template.color} />
      <div>
        <TemplateTitle>{title}</TemplateTitle>
        <TemplateSubTitle>{sandbox.description}</TemplateSubTitle>
      </div>
    </MyTemplate>
  );
};

export default CustomTemplate;
