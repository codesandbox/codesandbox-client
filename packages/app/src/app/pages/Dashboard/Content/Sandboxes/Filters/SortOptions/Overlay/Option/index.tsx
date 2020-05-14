import React, { FunctionComponent } from 'react';
import Check from 'react-icons/lib/md/check';

import { Container, IconContainer } from './elements';

type Props = {
  currentField: string;
  field: string;
  name: string;
  setField: (field: string) => void;
};
export const Option: FunctionComponent<Props> = ({
  currentField,
  field,
  name,
  setField,
}) => {
  const selected = field === currentField;

  return (
    <Container onClick={() => setField(field)} selected={selected}>
      <IconContainer>{selected && <Check />}</IconContainer> {name}
    </Container>
  );
};
