import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 1.5rem;
  color: white;
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
