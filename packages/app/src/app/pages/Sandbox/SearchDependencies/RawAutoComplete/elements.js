import styled from 'styled-components';
import Color from 'color';

export const AutoCompleteInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: transparent;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.45px;

  color: ${props => Color(props.theme.colors.dialog.foreground).rgbString()};
  padding: 0.75em 1em;
  z-index: 2;
`;

export const SuggestionInput = styled(AutoCompleteInput)`
  position: absolute;
  top: 0;
  left: 0;
  color: ${props =>
    Color(props.theme.colors.dialog.foreground)
      .alpha(0.3)
      .rgbString()};
  background-color: transparent;
  z-index: 1;
  pointer-events: none;
`;
