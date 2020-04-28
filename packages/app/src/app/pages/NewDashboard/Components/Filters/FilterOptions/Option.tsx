import React from 'react';
import { Element, Checkbox, Text } from '@codesandbox/components';

interface Props {
  color: string;
  id: string;
  style?: React.CSSProperties;
  niceName: string;
  selected: boolean;
  toggleTemplate: (name: string, selected: boolean) => void;
}

export const Option = ({
  color,
  id,
  style,
  niceName,
  selected,
  toggleTemplate,
}: Props) => {
  const checkBoxName = `${id}-checkbox`;
  return (
    <Element
      // selected={selected}
      onClick={e => {
        e.preventDefault();
        toggleTemplate(id, !selected);
      }}
      onMouseDown={e => {
        e.preventDefault();
      }}
      style={style}
    >
      <label htmlFor={checkBoxName} style={{ display: 'none' }}>
        {checkBoxName}
      </label>
      <Checkbox id={checkBoxName} color={color} checked={selected} />
      <Text>{niceName}</Text>
    </Element>
  );
};
