import styled from 'styled-components';

export const Container = styled.div`
  .Resizer {
    background: #000;
    opacity: 1;
    z-index: 99;
    box-sizing: border-box;
    background-clip: padding-box;
    opacity: ${props => (props.isDragging ? 0.6 : 0.4)};
  }

  .Resizer.vertical::after {
    content: '';
    position: absolute;
    top: calc(50% - 20px);
    height: 40px;
    width: 5px;
    background: #242424;
    border-radius: 50px;
    margin: 0 2px;
    border: 1px solid #fff;
  }

  .Resizer:hover {
    opacity: 0.6;
  }

  .Resizer.vertical {
    /* margin: 0 -5px; */
    cursor: ew-resize;
  }

  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: ns-resize;
    width: 100%;
  }

  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }
`;

export const PreviewContainer = styled.div`
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
