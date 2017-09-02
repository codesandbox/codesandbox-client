import styled from 'styled-components';

export default styled.h4`
  font-size: 0.875rem;
  margin: 0.5rem 0;
  font-weight: 400;
  color: ${props => props.theme.background3.lighten(0.5)};
  padding: 0 1rem;
`;
