import AutosizeTextAreaBase from '@codesandbox/common/lib/components/AutosizeTextArea';
import { Button as ButtonBase } from '@codesandbox/common/lib/components/Button';
import InputBase from '@codesandbox/common/lib/components/Input';
import styled, { css } from 'styled-components';

export const AutosizeTextArea = styled(AutosizeTextAreaBase)`
  width: 100%;
`;

export const Button = styled(ButtonBase)`
  float: right;
`;

export const ButtonContainer = styled.div`
  flex: 1;
`;

export const EmojiButton = styled.button<{ active: boolean }>`
  ${({ active, theme }) => css`
    transition: 0.3s ease all;
    border: 2px solid rgba(0, 0, 0, 0.2);
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    padding: 0.1rem;
    outline: 0;
    margin-right: 1rem;
    width: 32px;
    height: 32px;
    line-height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    span {
      display: inline;
      line-height: initial;
      width: 15px;
    }

    &:hover {
      border: 2px solid rgba(255, 255, 255, 0.2);
      background-color: ${theme.secondary};
    }
    &:focus {
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    ${active &&
      css`
        border: 2px solid rgba(255, 255, 255, 0.2);
        background-color: ${theme.secondary};
      `};
  `};
`;

export const Input = styled(InputBase)`
  width: 100%;
`;
