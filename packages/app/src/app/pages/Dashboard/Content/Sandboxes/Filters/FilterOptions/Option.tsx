import React from 'react';

import { Option as Container, OptionName, CheckBox } from './elements';

interface Props {
  color: string;
  id: string;
  style?: React.CSSProperties;
  niceName: string;
  selected: boolean;
  toggleTemplate: (name: string, selected: boolean) => void;
}

export default ({
  color,
  id,
  style,
  niceName,
  selected,
  toggleTemplate,
}: Props) => {
  const checkBoxName = `${id}-checkbox`;
  return (
    <Container
      selected={selected}
      onClick={e => {
        e.preventDefault();
        toggleTemplate(id, !selected);
      }}
      onMouseDown={e => {
        e.preventDefault();
      }}
      style={style}
    >
      <label htmlFor={checkBoxName} style={{ display: 'none' }} />
      <CheckBox id={checkBoxName} color={color} selected={selected} />
      <OptionName style={{ fontWeight: 500 }}>{niceName}</OptionName>
    </Container>
  );
};
