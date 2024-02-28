import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';

const placeholderStyles = {
  color: 'input.placeholderForeground',
  fontSize: 3,
  fontStyle: 'italic',
};

export interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: any;
}

export const Input = styled(Element).attrs(p => ({
  as: ((p as unknown) as { as: string }).as || 'input',
}))<IInputProps>(
  css({
    height: '28px',
    width: '100%',
    paddingX: '8px',
    fontSize: '13px',
    lineHeight: '16px',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '4px',
    backgroundColor: 'input.background',
    border: '1px solid',
    borderColor: 'input.border',
    color: 'input.foreground',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
    transition: 'all ease',
    transitionDuration: theme => theme.speeds[2],
    appearance: 'none',

    ':hover, :focus': {
      borderColor: 'inputOption.activeBorder',
      // need to use !important to override styles from
      // workbench-theme.css, not proud :/
      outline: 'none !important',
    },
    ':disabled': {
      color: '#999999',
      cursor: 'not-allowed',
      borderColor: 'input.border', // (default border)
    },
  })
);
