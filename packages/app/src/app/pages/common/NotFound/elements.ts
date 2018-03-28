import styled from 'app/styled-components';

export const Container = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 1.5rem;
  color: white;
  height: 100vh;
`;

export const Title = styled.h1`
  margin-bottom: 0;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  min-width: 450px;
  flex-wrap: wrap;
  margin-top: 0.5rem;
`;
