import styled from 'app/styled-components';

export const Version = styled<
    {
        hovering: boolean;
    },
    'div'
>('div')`
  transition: 0.3s ease all;
  position: absolute;
  right: ${(props) => (props.hovering ? 3.5 : 1)}rem;
  color: ${(props) => props.theme.background.lighten(2).clearer(0.5)};
`;
