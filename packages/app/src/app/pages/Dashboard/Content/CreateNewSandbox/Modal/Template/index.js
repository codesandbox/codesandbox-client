import React from 'react';
import getIcon from '@codesandbox/common/lib/templates/icons';

import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { Button, IconContainer, Title, SubTitle } from './elements';

export default ({ template, subtitle, selectTemplate, small }) => {
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
      tabIndex="0"
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
