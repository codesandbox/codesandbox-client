import React from 'react';
import { Template } from '../../types/index';
import getIcon from '../../templates/icons';
import { ENTER } from '../../utils/keycodes';
import color from 'color';
import { Button, IconContainer, Title } from './elements';
import { TemplateType } from '../../templates';

interface UserTemplate extends Template {
  iconUrl?: string;
  id?: string;
  title?: string;
  sandbox?: {
    alias: string;
    id: string;
    source: {
      template: TemplateType;
    };
  };
}

type Props = {
  template: UserTemplate;
  selectTemplate: (t: Template) => void;
  small: boolean;
};

export default ({ template, selectTemplate, small }: Props) => {
  const Icon = template.iconUrl
    ? getIcon(template.sandbox.source.template)
    : null;

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
        {template.iconUrl ? (
          // @ts-ignore
          <Icon width={small ? 24 : 32} height={small ? 24 : 32} />
        ) : (
          <img src={template.iconUrl} />
        )}
      </IconContainer>
      <Title>{template.title}</Title>
    </Button>
  );
};
