import styled, { css } from 'styled-components';

const makeColor = (color: any, custom: boolean) => {
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
  transition: 0.3s ease all;
  display: inline-block;
  text-align: left;
  padding: 1em;
  color: white;
  border: 2px solid rgba(0, 0, 0, 0.3);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  outline: none;

  ${props =>
    props.selected
      ? css`
          color: white;
          background-color: ${makeColor(
            props.color.clearer(0.3),
            props.custom
          )};
          border-color: rgba(255, 255, 255, 0.2);
        `
      : css`
          &:hover,
          &:focus {
            background-color: ${makeColor(
              props.color.clearer(0.6),
              props.custom
            )};
            border-color: rgba(255, 255, 255, 0.1);
          }
        `};
`;

export const Title = styled.div`
  font-family: Poppins, Roboto, sans-serif;
  font-weight: 500;
  font-size: 0.875rem;
  color: ${props => props.theme.placeholder};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 16px; /* fallback */
  max-height: 32px; /* fallback */
  -webkit-line-clamp: 2; /* number of lines to show */
  -webkit-box-orient: vertical;
`;

export const IconContainer = styled.div`
  margin-right: 0.75em;
  align-items: center;
  display: flex;
`;
