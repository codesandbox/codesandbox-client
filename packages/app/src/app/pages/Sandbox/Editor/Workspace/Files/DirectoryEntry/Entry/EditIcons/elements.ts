import styled from 'app/styled-components';
import fadeIn from 'common/utils/animation/fade-in';

export const Container = styled.div`
  display: flex;
  ${fadeIn(0)};
  vertical-align: middle;
  line-height: 1;
  align-items: center;
`;
