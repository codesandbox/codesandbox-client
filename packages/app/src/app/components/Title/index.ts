import styled, { component } from 'app/styled-components';
import delayEffect from 'common/utils/animation/delay-effect';

export default styled(
    component<{
        delay?: number;
        style?: {};
    }>('h1')
)`
  ${(props) => props.delay != null && delayEffect(props.delay || 0)};
  color: white;
  font-size: 2.5rem;
  font-weight: 300;
  background-color: transparent;
  margin-top: 0;
  border: none;
  outline: none;
  text-align: center;
`;
