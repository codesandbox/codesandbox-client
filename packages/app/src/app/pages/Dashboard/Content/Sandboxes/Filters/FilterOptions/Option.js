import React from 'react';

import { Option as Container, OptionName, CheckBox } from './elements';

export default ({ color, name, style, niceName, selected, toggleTemplate }) => {
  const checkBoxName = `${name}-checkbox`;
  return (
    <Container
      selected={selected}
      onClick={e => {
        e.preventDefault();
        toggleTemplate(name, !selected);
      }}
      onMouseDown={e => {
        e.preventDefault();
      }}
      style={style}
    >
      <label
        htmlFor={checkBoxName}
        type="checkbox"
        css={`
          display: none;
        `}
      />
      <CheckBox id={checkBoxName} color={color} selected={selected} />
      <OptionName
        css={`
          font-weight: 500;
        `}
      >
        {niceName}
      </OptionName>
    </Container>
  );
};
