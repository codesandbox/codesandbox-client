import fadeIn from '@codesandbox/common/es/utils/animation/fade-in';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  ${fadeIn(0)};
  vertical-align: middle;
  line-height: 1;
  align-items: center;
`;
