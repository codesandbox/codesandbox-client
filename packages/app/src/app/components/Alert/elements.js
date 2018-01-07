import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.background};
  color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
`;

export const Title = styled.div`
  display: flex;
  justify-content: center;
  font-weight: 500;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0 !important;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

export const Text = styled.div`
  font-size: 14px;
  text-align: center;
`;

export const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  button {
    display: flex;
    justify-content: center;
    width: 6rem;
    margin: 0.5rem;
  }
`;
