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

export const Option = React.forwardRef<HTMLDivElement, Props>(
  ({ color, id, style, niceName, selected, toggleTemplate, ...props }, ref) => {
    const checkBoxName = `${id}-checkbox`;
    return (
      <Container
        {...props}
        ref={ref}
        selected={selected}
        onClick={e => {
          e.preventDefault();
          toggleTemplate(id, !selected);
        }}
        style={style}
      >
        <label htmlFor={checkBoxName} style={{ display: 'none' }}>
          {checkBoxName}
        </label>
        <CheckBox id={checkBoxName} color={color} selected={selected} />
        <OptionName style={{ fontWeight: 500 }}>{niceName}</OptionName>
      </Container>
    );
  }
);
