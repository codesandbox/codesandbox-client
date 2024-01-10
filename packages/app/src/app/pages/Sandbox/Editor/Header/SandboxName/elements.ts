import AutosizeInput from 'react-input-autosize';
import styled, { css } from 'styled-components';

export const Folder = styled.div`
  display: none;

  @media screen and (min-width: 950px) {
    display: block;
  }
`;

export const Form = styled.form`
  position: relative;
  top: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NameInput = styled(AutosizeInput)`
  ${({ theme }) => css`
    input {
      display: inline-block;
      background-color: transparent;
      outline: 0;
      border: 0;
      margin: 0;
      padding: 0;
      text-align: center;
      color: ${theme['input.foreground']};
      font: inherit;
    }
  `};
`;

export const Main = styled.div`
  display: none;
  transition: opacity 0.25s ease-in-out;
  opacity: 0;
  z-index: 10;

  @media screen and (min-width: 826px) {
    display: block;
  }
`;

export const TemplateBadge = styled.label`
  ${({ theme }) => css`
    background: ${theme['activityBarBadge.background']};
    color: ${theme['activityBarBadge.foreground']};
    font-family: 'Inter', sans-serif;
    font-weight: 500;
    font-size: 11px;
    padding: 0 8px;
    border-radius: 2px;
    margin-left: 1rem;
    height: 1.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    cursor: default;
  `};
`;
