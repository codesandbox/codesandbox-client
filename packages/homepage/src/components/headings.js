import styled from 'styled-components';

export const Heading1 = styled.h1`
  font-size: 2.25rem;
  color: white;
  font-weight: 200;
`;

export const Heading3 = styled.h3`
  color: ${props => props.theme.secondary};
  font-size: 2rem;
  font-weight: 300;
`;
