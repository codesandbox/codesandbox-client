import styled from 'app/styled-components';

export const LeftOffset = styled<
    {
        depth: number;
    },
    'div'
>('div')`
  display: flex;
  flex-wrap: nowrap;
  padding-left: ${(props) => props.depth}rem;
`;
