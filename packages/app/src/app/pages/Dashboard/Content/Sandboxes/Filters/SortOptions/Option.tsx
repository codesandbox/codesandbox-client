import React, { forwardRef } from 'react';
import Check from 'react-icons/lib/md/check';
import { IconContainer, OptionContainer } from './elements';

interface Props {
  name: string;
  field: string;
  currentField: string;
  setField: (fieldToSet: string) => void;
}

export const Option = forwardRef<HTMLAnchorElement, Props>(
  ({ name, field, currentField, setField, ...props }, ref) => {
    const selected = field === currentField;
    return (
      <OptionContainer
        as="button"
        {...props}
        ref={ref}
        onClick={() => setField(field)}
        selected={selected}
        aria-selected={selected}
      >
        <IconContainer>{selected && <Check />}</IconContainer> {name}
      </OptionContainer>
    );
  }
);
