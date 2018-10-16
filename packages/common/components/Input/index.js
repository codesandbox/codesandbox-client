import styled, { css } from 'styled-components';

export const styles = css`
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
  width: ${({ block }) => (block ? '100%' : 'inherit')};
  box-sizing: border-box;

  border: 1px solid
    ${props =>
      props.error ? props.theme.red.clearer(0.5) : 'rgba(0, 0, 0, 0.1)'};

  &:focus {
    border-color: ${props => props.theme.secondary.clearer(0.6)};
  }
`;

const Input = styled.input`
  ${styles};
`;

export const TextArea = styled.textarea`
  ${styles};
`;

export default Input;
