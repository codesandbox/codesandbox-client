import styled, { css } from 'styled-components';

export const AutoCompleteInput = styled.input`
  ${({ theme }) => css`
    width: 100%;
    padding: 0.75em 1em;
    border: none;
    box-sizing: border-box;
    outline: none;
    background-color: ${theme['sideBar.background']};
    font-weight: 600;
    font-family: inherit;
    letter-spacing: 0.45px;
    color: ${theme.light ? theme.black : theme.white};
    z-index: 2;
  `}
`;

export const SuggestionInput = styled(AutoCompleteInput)`
  ${({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.3)`
      : css`rgba(255, 255, 255, 0.3)`};
    background-color: transparent;
    z-index: 1;
    pointer-events: none;
  `}
`;
