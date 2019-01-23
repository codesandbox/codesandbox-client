import styled from 'styled-components';

export const Container = styled.div`
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  height: 100vh;
`;

export const Title = styled.h1`
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

export const SubTitle = styled.h2`
  font-weight: 300;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  min-width: 450px;
  margin-top: 0.5rem;
`;
