import styled from 'styled-components';
import Color from 'color';

const darker = (light, color) =>
  Color(color)
    .darken(light ? 0.2 : 0.7)
    .hexString();

export const Container = styled.div`
  position: relative;
  color: ${props => props.theme.gray.darken(0.2)()};
  vertical-align: middle;
  font-size: 1rem;
`;

export const InputContainer = styled.div`
  input {
    border-radius: 2px;
    outline: none;
    border: 0px solid transparent;
    padding: 0.2rem 0.5rem;
    color: black;
    width: 100%;
    height: 26px;
    font-size: 13px;
    color: ${props =>
      props.theme['input.foreground'] || 'rgba(255, 255, 255, 0.8)'};
    box-sizing: border-box;
    border: 1px solid
      ${props =>
        darker(
          props.theme.light,
          props.theme['editor.background'] || props.theme.background()
        )};
    background-color: ${props =>
      props.theme['editor.background'] || props.theme.background()};
  }
`;
