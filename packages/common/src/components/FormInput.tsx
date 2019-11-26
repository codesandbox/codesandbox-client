import styled, { css } from 'styled-components';
import { unstable_FormInput as BaseFormInput } from 'reakit/Form';

export const FormInput = styled(BaseFormInput)<{ valid: boolean }>`
  ${({ valid }) => css`
    display: inline-flex;
    width: 100%;
    padding: 2px 8px;
    background-color: #242424;
    border: 1px solid ${valid ? css`#040404` : css`#e1270e`};
    border-radius: 2px;
    box-sizing: border-box;
    color: #999999;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 11px;
    line-height: 19px;
    transition: 0.3s ease border-color;
    outline: none;

    &:disabled {
      border-color: rgba(4, 4, 4, 0.4);
      color: rgba(153, 153, 153, 0.4);
    }

    &:hover,
    &:focus {
      ${valid &&
        css`
          border-color: #757575;
        `};
    }
  `}
`;
