import styled from 'styled-components';

export const AutoCompleteInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: ${props => props.theme.background2};
  font-weight: 600;
  color: ${props => props.theme.white};
  padding: 0.75em 1em;
  z-index: 2;
`;

export const SuggestionInput = styled(AutoCompleteInput)`
  position: absolute;
  top: 0;
  left: 0;
  color: rgba(255, 255, 255, 0.3);
  background-color: transparent;
  z-index: 1;
  pointer-events: none;
`;
