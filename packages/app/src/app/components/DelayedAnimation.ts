import delayEffect from '@codesandbox/common/es/utils/animation/delay-effect';
import styled from 'styled-components';

export const DelayedAnimation = styled.div<{ delay?: number }>`
  ${({ delay = 0 }) => delayEffect(delay)};
`;
