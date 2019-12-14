import styled, { css } from 'styled-components';
import Color from 'color';

const darker = (light, color) =>
  Color(color)
    .darken(light ? 0.3 : 0.7)
    .hexString();

export const Container = styled.div`
  display: flex;
  background-color: ${props =>
    props.theme['input.background'] || props.theme.background4};
  padding: 0.25rem;
  align-items: center;
  line-height: 1;
  /* box-shadow: 0 1px 3px #ddd; */
  height: 35px;
  min-height: 35px;
  box-sizing: border-box;
  z-index: 2;
`;

export const Icons = styled.div`
  display: flex;
`;

export const Icon = styled.button`
  display: inline-block;
  border: none;
  background-color: transparent;
  font-size: 1.5rem;
  line-height: 0.5;
  margin: 0 0.25rem;
  vertical-align: middle;
  text-align: center;
  padding: 0;
  outline: none;
  cursor: pointer;

${props =>
  props.bg &&
  css`
    border-radius: 2px;
    background-color: ${props.theme['editor.background'] ||
      props.theme.background()};
    border: 1px solid
      ${darker(
        props.theme.light,
        props.theme['editor.background'] || props.theme.background()
      )};
  `}

${props =>
  !props.moduleView &&
  css`
    &:hover svg path,
    &:hover svg rect {
      fill: ${props.theme.light ? 'black' : 'white'};
    }
  `}

  /* // TODO: Replace with new theme */
  ${props =>
    props.moduleView &&
    css`
      ${props.theme.light
        ? css`
            svg rect[fill='#E6E6E6'] {
              fill: #343434;
            }
            svg rect[fill='#343434'] {
              fill: #e6e6e6;
            }
            &:hover svg rect {
              fill: black;
            }
          `
        : css`
            &:hover svg rect:not([fill='#E6E6E6']) {
              fill: #757575;
            }
          `}
    `}
`;

export const AddressBarContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 0 0.25rem;
`;
