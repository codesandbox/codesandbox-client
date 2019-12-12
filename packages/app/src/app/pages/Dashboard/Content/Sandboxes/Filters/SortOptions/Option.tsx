import React from 'react';
import Check from 'react-icons/lib/md/check';

import { IconContainer, OptionContainer } from './elements';

interface Props {
  name: string;
  field: string;
  currentField: string;
  setField: (field: string) => void;
}

export const Option: React.FC<Props> = ({
  name,
  field,
  currentField,
  setField,
}) => {
  const selected = field === currentField;

  return (
    <OptionContainer onClick={() => setField(field)} selected={selected}>
      <IconContainer>{selected && <Check />}</IconContainer> {name}
    </OptionContainer>
  );
};
