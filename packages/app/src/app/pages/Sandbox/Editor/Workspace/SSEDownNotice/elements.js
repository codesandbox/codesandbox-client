import styled from 'styled-components';

export const Container = styled.div`
  color: rgba(255, 255, 255, 0.9);
  background-color: ${props => props.theme.secondary};
  padding: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.4;
`;
