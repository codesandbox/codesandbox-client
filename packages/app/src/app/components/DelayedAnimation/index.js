import styled from 'styled-components';
import delayEffect from 'common/libutils/animation/delay-effect';

export default styled.div`
  ${props => delayEffect(props.delay || 0)};
`;
