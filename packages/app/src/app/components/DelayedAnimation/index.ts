import styled from 'app/styled-components';
import delayEffect from 'common/utils/animation/delay-effect';

export default styled<
    {
        delay?: number;
    },
    'div'
>('div')`
  ${(props) => delayEffect(props.delay || 0)};
`;
