import React, { FunctionComponent } from 'react';
import css from '@styled-system/css';
import styled from 'styled-components';
import { useId } from '@reach/auto-id';
import { Element } from '../Element';
import { Text } from '../Text';

interface ICheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  label?: string | React.ReactElement;
  id?: string;
}

export const CheckboxElement = styled.input(
  css({
    left: 0,
    opacity: 0,
    position: 'absolute',
    top: 0,
    height: 4,
    width: 4,

    '&:checked + label::after': {
      opacity: 1,
      cursor: 'pointer',
    },

    '&:checked + label::before': {
      backgroundColor: 'button.background',
      borderColor: 'transparent',
    },
  })
);

const Label = styled(Text)(
  css({
    display: 'block',
    cursor: 'pointer',
    paddingLeft: 6,
    '&::before': {
      content: "''",
      height: 4,
      left: 0,
      position: 'absolute',
      top: 0,
      width: 4,
      borderRadius: 'small',
      backgroundColor: 'input.background',
      border: '1px solid ',
      borderColor: '#757575',
      transition: 'all ease-in',
      transitionDuration: theme => theme.speeds[1],
    },
    '&::after': {
      content: "''",
      borderLeft: 0,
      borderTop: 0,
      height: 3,
      left: '3px',
      opacity: 0,
      position: 'absolute',
      top: 1,
      backgroundImage: theme =>
        `url('data:image/svg+xml,%3Csvg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M5.0442 5.99535L10.2229 0.444443L11.3332 1.70347L5.0442 8.44444L0.666504 3.75212L1.77676 2.49309L5.0442 5.99535Z" fill="${theme.colors.input.foregroundReverse.replace(
          '#',
          '%23'
        )}"/%3E%3C/svg%3E%0A')`,
      backgroundRepeat: 'no-repeat',
      width: 3,
      transition: 'all ease-in',
      transitionDuration: theme => theme.speeds[2],
    },
  })
);

export const Checkbox: FunctionComponent<ICheckboxProps> = ({
  checked,
  id,
  label,
  disabled,
  ...props
}) => {
  const inputId = useId(id);
  return (
    <Element style={{ position: 'relative' }}>
      <CheckboxElement
        checked={checked}
        id={inputId}
        name={inputId}
        type="checkbox"
        disabled={disabled}
        {...props}
      />
      <Label
        css={disabled ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
        as="label"
        htmlFor={inputId}
      >
        {label}
      </Label>
    </Element>
  );
};
