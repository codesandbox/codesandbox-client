import styled from 'styled-components';

export const Container = styled.div`
  background-color: ${props => props.theme.background2};
  color: ${props => props.theme.white};
  padding: 1rem;
  margin: 0;
  border-radius: 4px;
  overflow: hidden;
`;
