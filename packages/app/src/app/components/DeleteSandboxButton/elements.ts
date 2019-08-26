import styled from 'styled-components';

export const Button = styled.button`
  padding: 5px 6px 9px 6px;
  border: none;
  background-color: inherit;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2em;
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 1);
  }

  &[disabled] {
    opacity: 0.5;
    cursor: default;
  }
`;
