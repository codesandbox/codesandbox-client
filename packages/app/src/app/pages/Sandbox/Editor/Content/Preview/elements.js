import styled from 'styled-components';
import fadeIn from 'common/utils/animation/fade-in';

const Resizer = styled.div`
  position: absolute;
  z-index: 20;
`;

const width = 8;

export const TopResizer = styled(Resizer)`
  top: -${width / 2}px;
  height: ${width}px;
  left: 0;
  right: 0;
  cursor: ns-resize;
`;

export const RightResizer = styled(Resizer)`
  top: 0;
  bottom: 0;
  width: ${width}px;
  right: -${width / 2}px;
  cursor: ew-resize;
`;

export const BottomResizer = styled(Resizer)`
  bottom: -${width / 2}px;
  height: ${width}px;
  left: 0;
  right: 0;
  cursor: ns-resize;
`;

export const LeftResizer = styled(Resizer)`
  top: 0;
  bottom: 0;
  width: ${width}px;
  left: -${width / 2}px;
  cursor: ew-resize;
`;

export const NEResizer = styled(Resizer)`
  top: -${width / 2}px;
  right: -${width / 2}px;
  width: ${width * 2}px;
  height: ${width * 2}px;
  cursor: nesw-resize;
`;

export const SEResizer = styled(Resizer)`
  bottom: -${width / 2}px;
  right: -${width / 2}px;
  width: ${width * 2}px;
  height: ${width * 2}px;
  cursor: nwse-resize;
`;

export const SWResizer = styled(Resizer)`
  bottom: -${width / 2}px;
  left: -${width / 2}px;
  width: ${width * 2}px;
  height: ${width * 2}px;
  cursor: nesw-resize;
`;

export const NWResizer = styled(Resizer)`
  top: -${width / 2}px;
  left: -${width / 2}px;
  width: ${width * 2}px;
  height: ${width * 2}px;
  cursor: nwse-resize;
`;

export const ResizingNotice = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 1rem;

  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 1.125rem;
  padding: 0.5rem 1rem;

  border-radius: 2px;
  ${fadeIn()};
`;
