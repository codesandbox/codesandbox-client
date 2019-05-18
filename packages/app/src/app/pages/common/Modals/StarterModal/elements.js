import styled, { createGlobalStyle } from 'styled-components';

export const Fieldset = styled.fieldset`
  padding: 0;
  border: none;
  margin: 10px 0;
  display: flex;
`;

export const Label = styled.label`
  margin-bottom: 5px;
`;

export const DefaultColor = styled.button`
  background: ${props => props.color};
  height: 2rem;
  width: 2rem;
  position: relative;
  border-radius: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0;
  border: none;
`;

export const GlobalStylesStarterModal = createGlobalStyle`
.ReactModal__Content.ReactModal__Content--after-open {
  overflow: visible !important;
}

.sketch-picker {
    position: absolute;
    margin-top: 10px;
}
`;
