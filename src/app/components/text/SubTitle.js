import styled from 'styled-components';
import delayEffect from '../../utils/animation/delay-effect';

export default styled.h2`
  ${props =>
    props.delay != null && delayEffect(props.delay || 0)} text-align: center;
  width: 100%;
  font-size: 1.75rem;
  color: ${props => props.theme.background2.lighten(2)};
  font-weight: 300;
  margin-top: 0;
  margin-bottom: 1.5rem;
  line-height: 1.4;
`;
