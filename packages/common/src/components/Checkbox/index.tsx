import React from 'react';
import styled from 'styled-components';

type Props = {
  checked?: boolean;
  style?: React.CSSProperties;
  onChange?: () => void;
  onClick?: () => void;
  id?: string;
};

const CheckBoxStyled = styled.input`
  background-image: none;
  border: 2px solid transparent;
  background: ${props =>
      props.theme.light ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'}
    url('') no-repeat 50%/10px;

  box-shadow: none;
  display: inline-block;
  border-radius: 3.5px;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 0.75rem;
  transition: 0.15s ease all;
  appearance: none;

  &:focus,
  &:active {
    border-color: ${props => props.theme.shySecondary};
  }

  &:checked {
    background: ${props => props.theme.shySecondary} url('') no-repeat 50%/10px;
    border-color: ${props => props.theme.shySecondary};
    background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 10 9' xmlns='http://www.w3.org/2000/svg'><path d='M1 4.88l2.378 2.435L9.046 1.6' stroke-width='1.6' stroke='%23FFF' fill='none' fill-rule='evenodd' stroke-linecap='round' stroke-linejoin='round'/></svg>");
  }
`;

export const Checkbox = (props: Props) => (
  <CheckBoxStyled type="checkbox" {...props} />
);
