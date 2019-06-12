import styled from 'styled-components';

export const Title = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: ${props => (props.theme.light ? '#636363' : 'white')};
  margin-bottom: 0.5rem;
`;
