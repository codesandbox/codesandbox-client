import styled, { css } from 'styled-components';

const makeColor = (color: any, custom: boolean) => {
  if (!custom) return color;

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

export const Title = styled.div<{
  color: any;
  selected?: boolean;
  custom?: boolean;
}>`
  transition: 0.3s ease color;
  font-size: 1.125em;
  color: ${props =>
    props.selected ? 'white' : makeColor(props.color, props.custom)};
  font-weight: 600;
`;

export const SubTitle = styled.div<{ selected?: boolean }>`
  font-size: 0.8em;
  margin-top: 0.25rem;

  color: ${props =>
    props.selected ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.4)'};
`;

export const IconContainer = styled.div`
  margin-left: 0.5em;
  align-items: center;
`;
