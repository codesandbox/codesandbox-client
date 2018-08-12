import styled from 'styled-components';

export const Description = styled.p`
  color: ${props =>
    props.theme.light
      ? 'rgba(0, 0, 0, 0.3)'
      : props.theme.background.lighten(2)};
  margin-top: 0;
  padding: 0 1rem;
  line-height: 1.2;
  font-size: 0.875rem;
`;

export const VersionDate = styled.div`
  position: absolute;
  right: 1rem;
  opacity: 0.5;
  color: ${props =>
    props.theme.light ? '#636363' : props.theme.background.lighten(2)};
`;
