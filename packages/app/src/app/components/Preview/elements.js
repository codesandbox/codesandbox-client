import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  width: 100%;
  background-color: white;

  display: flex;
  flex-direction: column;
`;

export const StyledFrame = styled.iframe`
  border-width: 0px;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
`;
