import React, { FunctionComponent } from 'react';
import Check from 'react-icons/lib/md/check';
import { Element } from '@codesandbox/components';

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
    <Element
      onClick={() => setField(field)}
      // selected={selected}
    >
      <Element>{selected && <Check />}</Element> {name}
    </Element>
  );
};
