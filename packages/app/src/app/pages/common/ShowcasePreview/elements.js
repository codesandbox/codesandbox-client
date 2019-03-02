import styled from 'styled-components';
import delayEffect from 'common/lib/utils/animation/delay-effect';

export const Container = styled.div`
  position: relative;
  ${delayEffect(0.4)} height: 500px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.5);

  iframe {
    height: calc(100% - 3rem);
  }
`;
