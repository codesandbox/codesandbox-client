import styled from 'styled-components';
import delayEffect from '@codesandbox/common/lib/utils/animation/delay-effect';

export default styled.div<{ delay: number }>`
  ${({ delay }) => delayEffect(delay || 0)};
`;
