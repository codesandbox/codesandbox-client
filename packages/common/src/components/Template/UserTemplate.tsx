import React from 'react';
import { Template } from '../../types/index';
import getIcon from '../../templates/icons';
import { ENTER } from '../../utils/keycodes';
import color from 'color';
import { Button, IconContainer, Title, SubTitle } from './elements';
import { TemplateType } from '../../templates';

interface UserTemplate extends Template {
  iconUrl?: string;
  id?: string;
  title?: string;
  description?: string;
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
  subtitle: string;
  selectTemplate: (t: Template) => void;
  small: boolean;
};

export default ({ template, subtitle, selectTemplate, small }: Props) => {
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
      <div style={{ width: '100%' }}>
        <Title custom color={color(template.color)}>
          {template.title}
        </Title>
        {(!small || subtitle) && (
          <SubTitle>{subtitle || template.description}</SubTitle>
        )}
      </div>
      <IconContainer>
        {template.iconUrl ? (
          // @ts-ignore
          <Icon width={small ? 24 : 32} height={small ? 24 : 32} />
        ) : (
          <img src={template.iconUrl} />
        )}
      </IconContainer>
    </Button>
  );
};
