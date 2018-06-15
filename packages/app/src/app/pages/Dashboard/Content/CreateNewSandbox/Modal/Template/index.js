import React from 'react';
import getIcon from 'common/templates/icons';

import { Container, IconContainer, Title, SubTitle } from './elements';

export default ({ template, width, selectTemplate }) => {
  const Icon = getIcon(template.name);

  const select = () => selectTemplate(template);

  return (
    <Container
      onClick={select}
      color={template.color}
      width={width}
      onKeyDown={e => {
        if (e.keyCode === 13) {
          select();
        }
      }}
      tabIndex="0"
    >
      <div style={{ width: '100%' }}>
        <Title color={template.color}>{template.niceName}</Title>
        <SubTitle>{template.name}</SubTitle>
      </div>
      <IconContainer>
        <Icon width={32} height={32} />
      </IconContainer>
    </Container>
  );
};
