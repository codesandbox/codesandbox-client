import styled, { css } from 'styled-components';

const makeColor = (color: any, custom: boolean): string => {
  if (!custom) {
    return color;
  }

  return color.rgbString();
};

export const Button = styled.button<{
  selected?: boolean;
  color: any;
  custom?: boolean;
}>`
  ${({ color, selected, custom }) => css`
    display: flex;
    align-items: center;
    padding: 1em;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
    text-align: left;
    transition: 0.3s ease all;
    cursor: pointer;
    outline: none;

    ${selected
      ? css`
          border-color: rgba(255, 255, 255, 0.2);
          background-color: ${makeColor(color.clearer(0.3), custom)};
          color: white;
        `
      : css`
          &:hover,
          &:focus {
            border-color: rgba(255, 255, 255, 0.1);
            background-color: ${makeColor(color.clearer(0.6), custom)};
          }
        `};
  `}
`;

export const Title = styled.div`
  ${({ theme }) => css`
    display: -webkit-box;
    max-height: 32px; /* fallback */
    color: ${theme.placeholder};
    font-family: Poppins, Roboto, sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 16px; /* fallback */
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2; /* number of lines to show */
    -webkit-box-orient: vertical;
  `}
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75em;
`;
