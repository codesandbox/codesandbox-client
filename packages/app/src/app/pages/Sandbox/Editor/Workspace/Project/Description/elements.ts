import styled from 'styled-components';

export const Description = styled.div`
  font-size: 0.875rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  margin-top: 0.5rem;
`;
