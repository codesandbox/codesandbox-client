import styled from 'app/styled-components';
import fadeIn from 'common/utils/animation/fade-in';

export const FullSize = styled.div`
  height: 100%;
  width: 100%;

  ${fadeIn(0)};
  display: flex;
  flex-direction: column;
`;
