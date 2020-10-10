import React from 'react';
import { Input } from '../components/Input';
import { KnobProps } from './BaseKnob';

const decodeValue = (value: string) => {
  const splittedValue = value.split('');
  if (splittedValue[0] === '{') {
    splittedValue.shift();
  }
  if (splittedValue[splittedValue.length - 1] === '}') {
    splittedValue.pop();
  }
  return splittedValue.join('');
};
const encodeValue = (value: string) => {
  if (value[0] !== '{' || value[value.length - 1] !== '}') {
    return `{${value}}`;
  }
  return value;
};

export const DefaultKnob = (props: KnobProps) => {
  const niceValue = decodeValue(props.value);

  return (
    <Input
      onChange={e => {
        props.setValue(encodeValue(e.target.value));
      }}
      value={niceValue}
      style={{ width: '100%' }}
    />
  );
};
