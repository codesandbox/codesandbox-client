import styled from 'styled-components';
import fadeIn from 'common/utils/animation/fade-in';

export const Icon = styled.div`
  position: relative;
  display: inline-block;
  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.5);
  padding-left: 0.5rem;
  &:hover {
    color: white;
  }
`;

export const IconArea = styled.div`
  position: absolute;
  right: 1rem;
  opacity: 0;
  line-height: 1;
  vertical-align: middle;
  ${fadeIn(0)};
`;
