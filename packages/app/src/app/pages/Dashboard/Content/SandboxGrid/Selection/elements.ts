import styled, { css } from 'styled-components';

import { animated } from 'react-spring/renderprops';

export const Container = styled(animated.div)`
  ${({ theme }) => css`
    position: fixed;
    border: 1px solid ${theme.secondary};
    background-color: ${theme.secondary.clearer(0.5)};
    pointer-events: none;
  `};
`;
