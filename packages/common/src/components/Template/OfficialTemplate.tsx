import React, { useCallback } from 'react';
import { Template } from '../../types/index';
import getIcon from '../../templates/icons';
import { ENTER } from '../../utils/keycodes';
import { Button, IconContainer, Title } from './elements';

type Props = {
  template: Template;
  selectTemplate: (t: Template) => void;
  small: boolean;
};

export default ({ template, selectTemplate, small }: Props) => {
  const Icon = getIcon(template.name);

  const select = useCallback(() => {
    selectTemplate(template);
  }, [selectTemplate, template]);

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
      <IconContainer>
        <Icon width={small ? 24 : 32} height={small ? 24 : 32} />
      </IconContainer>
      <div style={{ width: '100%' }}>
        <Title>{template.niceName}</Title>
      </div>
    </Button>
  );
};
