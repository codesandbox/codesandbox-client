import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: ${theme.background};
    color: rgba(255, 255, 255, 0.8);
  `}
`;

export const Title = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0 !important;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  font-weight: 500;
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
