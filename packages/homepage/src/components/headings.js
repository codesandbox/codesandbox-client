import styled from 'styled-components';

export const Heading1 = styled.h1`
  font-size: 2.25rem;
  color: white;
  font-weight: 200;
`;

export const Heading2 = styled.h2`
  font-size: 1.5rem;
  color: #eeeeff;
  font-weight: 600;
`;

export const Heading3 = styled.h3`
  color: ${props => props.theme.secondary};
  font-size: 2rem;
  font-weight: 300;
`;
