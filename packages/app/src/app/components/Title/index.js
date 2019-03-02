import styled from 'styled-components';
import delayEffect from 'common/lib/utils/animation/delay-effect';

export default styled.h1`
  ${props => props.delay != null && delayEffect(props.delay || 0)};
  color: white;
  font-size: 2.5rem;
  font-weight: 300;
  background-color: transparent;
  margin-top: 0;
  border: none;
  outline: none;
  text-align: center;
`;
