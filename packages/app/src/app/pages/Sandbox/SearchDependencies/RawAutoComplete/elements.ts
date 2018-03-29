import styled from 'app/styled-components';

export const AutoCompleteInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: ${props => props.theme.background2};
  font-weight: 600;
  color: ${props => props.theme.white};
  padding: 0.75em 1em;
`;
