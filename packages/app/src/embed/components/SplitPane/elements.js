import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;

  .Resizer {
    background: #000;
    opacity: 1;
    z-index: 99;
    box-sizing: border-box;
    background-clip: padding-box;
    opacity: ${props => (props.isDragging ? 0.6 : 0.4)};
  }

  .Resizer::after {
    content: '';
    background: #242424;
    border-radius: 50px;
    border: 1px solid #fff;
    transition: margin 500ms;
  }

  .Resizer:hover {
    opacity: 0.6;
  }

  .Resizer.vertical {
    cursor: ew-resize;
  }

  .Resizer.vertical::after {
    position: absolute;
    top: calc(50% - 20px);
    height: 40px;
    width: 5px;
    margin-left: ${props => (props.size === props.totalSize ? -12 : 4)}px;
  }

  .Resizer.horizontal {
    cursor: ns-resize;
  }
  .Resizer.horizontal::after {
    position: absolute;
    left: calc(50% - 20px);
    width: 40px;
    height: 5px;
    margin-top: -12px;
    /* margin-top: ${props => (props.size === props.totalSize ? -12 : 4)}px; */
  }
`;

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const IframeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const PointerOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
`;
