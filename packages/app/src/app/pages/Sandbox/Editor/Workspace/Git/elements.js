import styled from 'styled-components';

export const Container = styled.div`
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
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
