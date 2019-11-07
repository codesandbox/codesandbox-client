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
    /* Safari, sigh.
      We recently encountered this and discovered that promoting the
      affected element to a composite layer with translateZ in CSS fixed
      the issue without needing extra JavaScript.
      https://stackoverflow.com/a/21947628/1501871
    */
    transform: translateZ(0);
  }

  .Resizer:hover {
    opacity: 0.6;
  }

  .Resizer::after {
    content: '';
    background: #242424;
    border-radius: 50px;
    border: 1px solid #fff;
    transition: margin 500ms, height 150ms, top 150ms ease;
  }

  .Resizer.vertical::after {
    position: absolute;
    width: 5px;
    height: ${props => (props.isDragging ? 32 : 40)}px;
    top: ${props =>
      props.isDragging ? `calc(50% - 16px)` : `calc(50% - 20px)`};
    margin-left: ${props => (props.size === props.maxSize ? -12 : 4)}px;
  }
  /* .Resizer.vertical:hover::after {
    height: 44px;
    top: calc(50% - 22px);
  } */

  /* Big tap area - 48*2 by 48*/
  .Resizer::before {
    content: '';
    position: absolute;
    width: calc(48px * 2);
    height: 64px;
    top: calc(50% - 32px);
    left: -48px;
  }

  .Resizer.vertical {
    cursor: ew-resize;
  }

  .Pane {
    transition: ${props => (props.isDragging ? null : 'width 200ms ease')};
  }
`;

export const PaneContainer = styled.div`
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
