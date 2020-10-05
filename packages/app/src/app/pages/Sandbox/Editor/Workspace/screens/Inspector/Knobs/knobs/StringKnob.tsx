import { Input } from '@codesandbox/components';
import React from 'react';
import { KnobProps } from './BaseKnob';

const nicifyValue = (value: string) => {
  const splittedValue = value.split('"');
  if (splittedValue[0] === '"') {
    splittedValue.shift();
  }
  if (splittedValue[splittedValue.length - 1] === '"') {
    splittedValue.pop();
  }
  return splittedValue.join('');
};

export const StringKnob = (props: KnobProps) => {
  const parsedValue = nicifyValue(props.value);

  return (
    <Input
      onChange={e => {
        props.setValue('"' + e.target.value + '"');
      }}
      value={parsedValue}
      style={{ width: '100%' }}
    />
  );
};
