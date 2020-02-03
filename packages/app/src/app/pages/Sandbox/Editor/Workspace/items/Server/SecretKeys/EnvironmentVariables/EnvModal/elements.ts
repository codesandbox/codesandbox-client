import { Button } from '@codesandbox/common/lib/components/Button';
import Input from '@codesandbox/common/lib/components/Input';
import styled, { css } from 'styled-components';

export const ButtonsContainer = styled.div`
  display: flex;
`;

export const CancelButton = styled(Button).attrs({
  red: true,
  small: true,
})`
  flex: 1;
  margin-right: 0.25rem;
`;

export const ErrorMessage = styled.div`
  ${({ theme }) => css`
    color: ${theme.red};
    font-size: 12px;
    margin: 0.5rem 0;
    font-style: italic;
  `};
`;

export const Form = styled.form`
  width: 100%;
`;

export const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-bottom: 0.5rem;
`;

export const NameInput = styled(Input)`
  margin-bottom: 0.25rem;
`;

export const SaveButton = styled(Button).attrs({
  block: true,
  small: true,
})<{ cancelButtonPresent: boolean }>`
  ${({ cancelButtonPresent }) => css`
    flex: 1;
    margin-left: ${cancelButtonPresent ? '0.25rem' : 0};
  `};
`;
