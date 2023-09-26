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
      backgroundColor: 'button.background',
    },
  })
);

const Label = styled(Text)(
  css({
    display: 'block',
    paddingLeft: 6,
    '&::before': {
      borderRadius: '50%',
      content: "''",
      height: 4,
      left: 0,
      position: 'absolute',
      top: 0,
      width: 4,
      backgroundColor: 'input.background',
      borderColor: 'mutedForeground',
      borderStyle: 'solid',
      borderWidth: '1px',
      transition: 'all ease-in',
      transitionDuration: theme => theme.speeds[2],
    },
    '&::after': {
      borderRadius: '50%',
      content: "''",
      borderLeft: 0,
      borderTop: 0,
      height: '6px',
      opacity: 0,
      position: 'absolute',
      top: '6px',
      left: '6px',
      backgroundColor: 'input.foregroundReverse',
      width: '6px',
      transition: 'all ease-in',
      transitionDuration: theme => theme.speeds[2],
    },
  })
);

export const Radio: FunctionComponent<IRadioProps> = ({
  checked,
  id,
  label,
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
        {...props}
      />
      <Label as="label" htmlFor={inputId}>
        {label}
      </Label>
    </Element>
  );
};
