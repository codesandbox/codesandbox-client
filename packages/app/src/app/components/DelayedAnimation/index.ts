import styled, { component } from 'app/styled-components';
import delayEffect from 'common/utils/animation/delay-effect';

export default styled(component<{
  delay?: number
}>())`
  ${props => delayEffect(props.delay || 0)};
`;
