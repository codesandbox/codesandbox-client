import styled from 'styled-components';

export default styled.div`
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
