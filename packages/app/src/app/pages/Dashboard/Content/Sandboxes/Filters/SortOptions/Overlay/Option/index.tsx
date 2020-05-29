import React, { FunctionComponent } from 'react';
import { MdCheck } from 'react-icons/md';

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
      <IconContainer>{selected && <MdCheck />}</IconContainer> {name}
    </Container>
  );
};
