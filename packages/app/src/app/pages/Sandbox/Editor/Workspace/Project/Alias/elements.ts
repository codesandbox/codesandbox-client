import styled from 'styled-components';

export const Alias = styled.div`
  font-size: 0.875rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  margin-top: 0.5rem;
`;
