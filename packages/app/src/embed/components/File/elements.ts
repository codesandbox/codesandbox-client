import styled, { component } from 'app/styled-components';

export const LeftOffset = styled(
    component<{
        depth: number;
    }>()
)`
  display: flex;
  flex-wrap: nowrap;
  padding-left: ${(props) => props.depth}rem;
`;
