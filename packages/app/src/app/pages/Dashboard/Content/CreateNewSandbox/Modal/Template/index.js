import React from 'react';
import getIcon from 'common/templates/icons';

import { Container, IconContainer, Title, SubTitle } from './elements';

export default ({ template, subtitle, width, selectTemplate, small }) => {
  const Icon = getIcon(template.name);

  const select = () => selectTemplate(template);

  const size = template.name === 'next' ? 64 : 32;

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
      <div
        css={`
          width: 100%;
        `}
      >
        <Title color={template.color}>{template.niceName}</Title>
        {(!small || subtitle) && (
          <SubTitle>{subtitle || template.name}</SubTitle>
        )}
      </div>
      <IconContainer>
        <Icon width={small ? 24 : size} height={small ? 24 : 32} />
      </IconContainer>
    </Container>
  );
};
