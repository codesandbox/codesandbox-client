import styled from 'app/styled-components';

export const Description = styled.p`
  color: ${props => props.theme.background.lighten(2)};
  margin-top: 0;
  padding: 0 1rem;
  line-height: 1.2;
  font-size: 0.875rem;
`;

export const VersionDate = styled.div`
  position: absolute;
  right: 1rem;
  color: ${props => props.theme.background.lighten(2).clearer(0.5)};
`;
