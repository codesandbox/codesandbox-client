import React from 'react';
import { Template } from '../../types/index';
import getIcon from '../../templates/icons';
import { ENTER } from '../../utils/keycodes';
import { Button, IconContainer, Title, SubTitle } from './elements';

type Props = {
  template: Template;
  subtitle: string;
  selectTemplate: (t: Template) => void;
  small: boolean;
};

export default ({ template, subtitle, selectTemplate, small }: Props) => {
  const Icon = getIcon(template.name);

  const select = () => selectTemplate(template);

  const size = template.name === 'next' ? 64 : 32;

  return (
    <Button
      onClick={select}
      color={template.color}
      onKeyDown={e => {
        if (e.keyCode === ENTER) {
          select();
        }
      }}
      tabIndex={0}
    >
      <div style={{ width: '100%' }}>
        <Title color={template.color}>{template.niceName}</Title>
        {(!small || subtitle) && (
          <SubTitle>{subtitle || template.name}</SubTitle>
        )}
      </div>
      <IconContainer>
        <Icon width={small ? 24 : size} height={small ? 24 : 32} />
      </IconContainer>
    </Button>
  );
};
