import styled from 'styled-components';
import delayEffect from 'common/utils/animation/delay-effect';

export const Container = styled.div`
  float: right;
  flex: 1;
  display: flex;
  height: 100%;
  max-width: 450px;
  margin-bottom: 4rem;
  align-items: center;

  ${delayEffect(0.1)};
`;

export const Stats = styled.div`
  flex: 1;
  display: flex;
  height: 100%;

  justify-content: center;
  align-items: top;
  font-size: 1.25rem;
`;
