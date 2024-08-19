import React, { FunctionComponent } from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';
import { useId } from '@reach/auto-id';
import { Element } from '../Element';
import { Text } from '../Text';

interface IRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  label?: string;
  id?: string;
}

export const RadioElement = styled.input(
  css({
    left: 0,
    opacity: 0,
    position: 'absolute',
    top: 0,
    height: 4,
    width: 4,

    '&:checked + label::after': {
      opacity: 1,
    },

    '&:checked + label::before': {
      borderColor: 'button.background',
      backgroundColor: 'input.foregroundReverse',
    },
  })
);

const Label = styled(Text)(
  css({
    display: 'block',
    paddingLeft: 6,
    '&::before': {
      boxSizing: 'border-box',
      borderRadius: '50%',
      content: "''",
      height: 4,
      left: 0,
      position: 'absolute',
      top: 0,
      width: 4,
      backgroundColor: 'input.foregroundReverse',
      borderColor: 'mutedForeground',
      borderStyle: 'solid',
      borderWidth: '1px',
    },
    '&::after': {
      boxSizing: 'border-box',
      borderRadius: '50%',
      content: "''",
      borderLeft: 0,
      borderTop: 0,
      height: '8px',
      opacity: 0,
      position: 'absolute',
      top: '4px',
      left: '4px',
      backgroundColor: 'button.background',
      width: '8px',
    },
  })
);

export const Radio: FunctionComponent<IRadioProps> = ({
  checked,
  id,
  label,
  disabled,
  ...props
}) => {
  const inputId = useId(id);
  return (
    <Element style={{ position: 'relative' }}>
      <RadioElement
        checked={checked}
        id={inputId}
        name={inputId}
        type="radio"
        disabled={disabled}
        {...props}
      />
      <Label
        as="label"
        size={3}
        htmlFor={inputId}
        variant={checked ? 'body' : 'muted'}
        css={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        {label}
      </Label>
    </Element>
  );
};
