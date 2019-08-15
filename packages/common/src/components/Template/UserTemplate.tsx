import React from 'react';
import Icons from '@codesandbox/template-icons';
import { Template } from '../../types/index';
import getIcon from '../../templates/icons';
import { ENTER } from '../../utils/keycodes';
import color from 'color';
import { Button, IconContainer, Title } from './elements';
import { TemplateType } from '../../templates';
import { getSandboxName } from '../../utils/get-sandbox-name';

interface UserTemplate extends Template {
  iconUrl?: string;
  id?: string;
  title?: string;
  sandbox?: {
    alias: string;
    id: string;
    title: string;
    source: {
      template: TemplateType;
    };
  };
}

interface IUserTemplateProps {
  template: UserTemplate;
  selectTemplate: (t: Template) => void;
  small: boolean;
}

export const UserTemplate = ({
  template,
  selectTemplate,
  small,
}: IUserTemplateProps) => {
  const Icon =
    template.iconUrl && Icons[template.iconUrl]
      ? Icons[template.iconUrl]
      : getIcon(template.sandbox.source.template);

  const select = () =>
    selectTemplate({
      ...template,
      shortid: template.sandbox.alias || template.sandbox.id,
    });

  return (
    <Button
      onClick={select}
      color={color(template.color)}
      custom
      onKeyDown={e => {
        if (e.keyCode === ENTER) {
          select();
        }
      }}
      tabIndex={0}
    >
      <IconContainer>
        <Icon width={small ? 24 : 32} height={small ? 24 : 32} />
      </IconContainer>
      <Title>{getSandboxName(template.sandbox)}</Title>
    </Button>
  );
};
