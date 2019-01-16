import styled, { css } from 'styled-components';

export const EmojiButton = styled.button`
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
    background-color: ${props => props.theme.secondary};
  }
  &:focus {
    border: 2px solid rgba(255, 255, 255, 0.2);
  }

  ${props =>
    props.active &&
    css`
      border: 2px solid rgba(255, 255, 255, 0.2);
      background-color: ${props.theme.secondary};
    `};
`;
