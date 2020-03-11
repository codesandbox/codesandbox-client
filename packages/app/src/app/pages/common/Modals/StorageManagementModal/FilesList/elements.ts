import styled, { css } from 'styled-components';

export const CheckBox = styled.span<{ selected: boolean }>`
  ${({ selected }) => css`
    ${selected
      ? css`
          background: url('') no-repeat 50%/10px;
          background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 10 9' xmlns='http://www.w3.org/2000/svg'><path d='M1 4.88l2.378 2.435L9.046 1.6' stroke-width='1.6' stroke='%23FFF' fill='none' fill-rule='evenodd' stroke-linecap='round' stroke-linejoin='round'/></svg>");
        `
      : css`
          background: rgba(0, 0, 0, 0.3) url('') no-repeat 50%/10px;
          background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 10 9' xmlns='http://www.w3.org/2000/svg'><path fill='rgba(255, 255, 255, 0.2)/></svg>");
        `};
    border: 2px solid rgba(255, 255, 255, 0.5);
    box-shadow: none;
    display: inline-block;
    border-radius: 2px;
    width: 16px;
    height: 16px;
    outline: none;
    vertical-align: middle;
    transition: 0.15s ease all;
    cursor: pointer;
  `};
`;
