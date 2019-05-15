import styled, { css } from 'styled-components';

export const CheckBox = styled.span`
  ${props =>
    props.selected
      ? css`
          background: ${props.color} url('') no-repeat 50%/10px;
          background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 10 9' xmlns='http://www.w3.org/2000/svg'><path d='M1 4.88l2.378 2.435L9.046 1.6' stroke-width='1.6' stroke='%23FFF' fill='none' fill-rule='evenodd' stroke-linecap='round' stroke-linejoin='round'/></svg>");
        `
      : css`
          background: rgba(0, 0, 0, 0.3) url('') no-repeat 50%/10px;
        `};
  border: 2px solid transparent;

  ${props =>
    props.selected &&
    css`
      border-color: ${props.color};
    `};
  box-shadow: none;
  display: inline-block;
  border-radius: 3.5px;
  width: 16px;
  height: 16px;
  outline: none;
  vertical-align: middle;
  margin-right: 0.75rem;
  transition: 0.15s ease all;
  cursor: pointer;
`;

export const Fieldset = styled.fieldset`
  padding: 0;
  border: none;
  margin: 10px 0;
  display: flex;
`;

export const Label = styled.label`
  margin-bottom: 5px;
`;
