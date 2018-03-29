import styled from 'app/styled-components';

export const Container = styled.div`
  color: rgba(255, 255, 255, 0.8);
`;

export const Buttons = styled.div`
  display: flex;
  margin: 1rem 0.125rem;

  button {
    margin: 0 0.875rem;
  }
`;

export const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.red};
  margin: 1rem;
  font-size: 0.875rem;
`;

export const Notice = styled.div`
  font-size: 0.75rem;
  color: white;
  padding: 0.125rem 0.2rem;
  background-image: linear-gradient(
    45deg,
    ${({ theme }) => theme.secondary.darken(0.2)} 0%,
    ${({ theme }) => theme.secondary.darken(0.1)} 100%
  );
  border-radius: 4px;
  float: right;
  margin-right: 2rem;
`;
