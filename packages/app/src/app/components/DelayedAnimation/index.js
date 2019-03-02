import styled from 'styled-components';
import delayEffect from 'common/lib/utils/animation/delay-effect';

export default styled.div`
  ${props => delayEffect(props.delay || 0)};
`;
