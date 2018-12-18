import styled from 'styled-components';

export const Container = styled.div`
  color: white;
  background-color: ${props => props.theme.secondary};
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
`;

export const Maintenance = styled.p`
  font-weight: 700;
  margin-top: 0px;
`;

export const NoBottom = styled.p`
  margin-bottom: 0px;
`;
