import styled, { createGlobalStyle } from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  z-index: 30;
`;

export const GlobalStyles = createGlobalStyle`
  .monaco-quick-open-widget {
    z-index: 50 !important;
  }
`;
