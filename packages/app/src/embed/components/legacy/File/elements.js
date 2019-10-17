// @flow
import styled from 'styled-components';

export const LeftOffset = styled.div`
  display: flex;
  flex-wrap: nowrap;
  padding-left: ${props => props.depth}rem;
`;
