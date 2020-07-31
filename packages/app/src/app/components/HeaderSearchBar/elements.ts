import styled, { css } from 'styled-components';
import BaseSearchIcon from 'react-icons/lib/go/search';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-weight: 500;
`;

export const Input = styled.input.attrs({
  type: 'text',
})`
  ${({ theme }) => css`
    z-index: 20;
    width: 10em;
    padding: 0.35em 0.5em;
    padding-right: 1.75em;
    border: 1px solid transparent;
    border-radius: 4px;
    background-color: ${theme[`input.background`] ||
      css`rgba(255, 255, 255, 0.1)`};
    color: ${theme[`input.foreground`] || css`white`};
    font-weight: 500;
    transition: 0.4s ease all;
    outline: none;

    &::-webkit-input-placeholder {
      font-weight: 500;
    }

    &:focus {
      width: 14em;
    }
  `}
`;

export const SearchButton = styled.button.attrs({
  type: 'submit',
})`
  position: absolute;
  z-index: 20;
  right: 0;
  top: 50%;
  padding: 0.35em 0.5em;
  border: none;
  background: transparent;
  outline: none;
  transform: translate(0, -50%);
  cursor: pointer;
`;

export const SearchIcon = styled(BaseSearchIcon)`
  ${({ theme }) => css`
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};
    font-size: 0.875em;
  `}
`;
