import styled, { css } from 'styled-components';

export interface IInputProps {
  block?: boolean;
  fullWidth?: boolean;
  error?: boolean;
}

export const styles = css<IInputProps>`
  transition: 0.3s ease border-color;
  background-color: ${props =>
    props.theme['input.background'] || 'rgba(0, 0, 0, 0.3)'};
  color: ${props =>
    props.theme['input.foreground'] ||
    (props.theme.light ? '#636363' : 'white')};
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 0.25em;
  width: ${({ block, fullWidth }) => (block || fullWidth ? '100%' : 'inherit')};
  box-sizing: border-box;

  border: 1px solid
    ${props =>
      props.error ? props.theme.red.clearer(0.5) : 'rgba(0, 0, 0, 0.1)'};

  &:focus {
    border-color: ${props => props.theme.secondary.clearer(0.6)};
  }
`;

const Input = styled.input<IInputProps>`
  ${styles};
`;

export const TextArea = styled.textarea<IInputProps>`
  ${styles};
`;

export default Input;
