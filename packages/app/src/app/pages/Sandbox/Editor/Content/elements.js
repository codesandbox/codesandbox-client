import fadeIn from '@codesandbox/common/es/utils/animation/fade-in';
import styled from 'styled-components';

export const FullSize = styled.div`
  height: 100%;
  width: 100%;

  ${fadeIn(0)};
  display: flex;
  flex-direction: column;

  background-color: ${props =>
    props.theme['editor.background'] || 'transparent'};
`;
