import styled from 'styled-components';

export const Icon = styled.a`
  display: inline-block;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'};
  font-size: 1.125em;
  margin-right: 0.5em;

  &:hover {
    color: ${props =>
      props.theme.light ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)'};
  }
`;
