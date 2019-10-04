import React from 'react';
import Check from 'react-icons/lib/md/check';
import { IconContainer, OptionContainer } from './elements';

export const Option = ({ name, field, currentField, setField, ...props }) => {
  const selected = field === currentField;
  return (
    <OptionContainer
      as="button"
      onClick={() => setField(field)}
      selected={selected}
      aria-selected={selected}
      {...props}
    >
      <IconContainer>{selected && <Check />}</IconContainer> {name}
    </OptionContainer>
  );
};
