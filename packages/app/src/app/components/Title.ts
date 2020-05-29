import delayEffect from '@codesandbox/common/es/utils/animation/delay-effect';
import styled, { css } from 'styled-components';

export const Title = styled.h1<{ delay?: number | null }>`
  ${({ delay = 0 }) => css`
    margin-top: 0;
    border: none;
    background-color: transparent;
    color: white;
    font-size: 2.5rem;
    font-weight: 300;
    text-align: center;
    outline: none;
    ${delay !== null && delayEffect(delay)};
  `}
`;
