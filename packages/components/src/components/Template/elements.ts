import styled, { css } from 'styled-components';
import Color from 'color';

const makeColor = (
  color: any,
  custom: boolean,
  checkContrast: boolean,
  theme?: any
): string => {
  if (!custom) {
    return color;
  }

  if (checkContrast && theme) {
    return color.contrast(Color('#fff')) < 6.5
      ? color.rgbString()
      : theme.gray();
  }

  return color.rgbString();
};

export const Button = styled.button<{
  selected?: boolean;
  color: any;
  custom?: boolean;
}>`
  ${({ color, selected, custom, theme }) => css`
    display: flex;
    align-items: center;
    padding: 1em;
    border: 2px solid rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    color: ${makeColor(color, custom, true, theme)};
    text-align: left;
    transition: 0.3s ease all;
    cursor: pointer;
    outline: none;

    ${selected
      ? css`
          border-color: rgba(255, 255, 255, 0.2);
          background-color: ${makeColor(color.clearer(0.3), custom, false)};
          color: ${makeColor(color, custom, true, theme)};
        `
      : css`
          &:hover,
          &:focus {
            border-color: rgba(255, 255, 255, 0.1);
            color: white;
            background-color: ${makeColor(color.clearer(0.6), custom, false)};
          }
        `};
  `}
`;

export const Title = styled.div`
  display: -webkit-box;
  max-height: 32px; /* fallback */
  font-family: Poppins, Roboto, sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 16px; /* fallback */
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75em;
`;
