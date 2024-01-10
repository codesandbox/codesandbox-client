import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  padding-top: 3vh;
  text-align: left;
  box-sizing: border-box;
  max-width: 670px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
`;

export const ContentContainer = styled.div`
  height: 100%;
  width: 100%;
  text-align: left;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: center;

  > button {
    margin: 1rem;
  }
`;
