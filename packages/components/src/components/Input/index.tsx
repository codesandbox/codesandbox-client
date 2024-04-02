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
    width: '100%',
    padding: '8px',
    fontSize: '13px',
    lineHeight: '16px',
    fontFamily: 'Inter, sans-serif',
    borderRadius: '4px',
    backgroundColor: '#000',
    border: '1px solid',
    borderColor: '#525252',
    color: '#fff',
    '::-webkit-input-placeholder': placeholderStyles,
    '::-ms-input-placeholder': placeholderStyles,
    '::placeholder': placeholderStyles,
    transition: 'all ease',
    transitionDuration: theme => theme.speeds[2],
    appearance: 'none',
    boxShadow: '0px 0px 0px 0px rgba(189, 177, 246, 0.50)',
    outline: 'none',

    ':hover, :focus': {
      borderColor: '#ADADAD',
    },
    ':focus': {
      borderColor: '#BDB1F6',
      boxShadow: '0px 0px 16px 0px rgba(189, 177, 246, 0.50)',
    },
    ':disabled': {
      color: '#999999',
      cursor: 'not-allowed',
      borderColor: 'input.border', // (default border)
    },
  })
);
