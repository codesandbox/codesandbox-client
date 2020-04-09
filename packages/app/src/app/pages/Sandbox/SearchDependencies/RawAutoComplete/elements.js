import styled from 'styled-components';

export const AutoCompleteInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: ${props => props.theme['sideBar.background']};
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.45px;

  color: ${props =>
    props.theme.light ? props.theme.black : props.theme.white};
  padding: 0.75em 1em;
  z-index: 2;
`;

export const SuggestionInput = styled(AutoCompleteInput)`
  position: absolute;
  top: 0;
  left: 0;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
  background-color: transparent;
  z-index: 1;
  pointer-events: none;
`;
