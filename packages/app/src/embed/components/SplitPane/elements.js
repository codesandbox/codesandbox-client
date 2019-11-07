import styled, { css, keyframes } from 'styled-components';

const introduction = {
  bounce: keyframes`
    0% {
      transform: scaleY(1);
      background: #fff;
      opacity: 1;

    }
    16% { transform: scaleY(0.8) }
    28% { transform: scaleY(1.8) }
    44% { transform: scaleY(0.8) }
    59% { transform: scaleY(1.2) }
    73% { transform: scaleY(0.95) }
    88% { transform: scaleY(1.05) }
    100% {
      transform: scaleY(1);
      background: #fff;
      opacity: 1;

    }
  `,
  fade: keyframes`
    0% {
      opacity: 1;
      background: #fff;
    }
    100% {
      opacity: 0.6;
      background: #242424;
    }
  `,
};

const notIntroducedYet = css`
  transform: scaleY(1);
  background: #fff;
  opacity: 1;
`;

const introductionAnimation = css`
  animation: ${introduction.bounce} 2s, ${introduction.fade} 1s 1s;
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;

  .Resizer {
    background: #000;
    z-index: 99;
    box-sizing: border-box;
    background-clip: padding-box;
    /* Safari, sigh.
      We recently encountered this and discovered that promoting the
      affected element to a composite layer with translateZ in CSS fixed
      the issue without needing extra JavaScript.
      https://stackoverflow.com/a/21947628/1501871
    */
    transform: translateZ(0);
  }

  .Resizer::after {
    opacity: ${props => (props.isDragging ? 0.6 : 0.4)};
    content: '';
    background: #242424;
    border-radius: 50px;
    border: 1px solid #fff;
    transition: margin 500ms, height 150ms, top 150ms ease;
    ${props => (props.hasAttention ? introductionAnimation : notIntroducedYet)};
  }
  .Resizer:hover::after {
    opacity: 0.6;
  }

  .Resizer.vertical::after {
    position: absolute;
    width: 5px;
    height: ${props => (props.isDragging ? 32 : 40)}px;
    top: ${props =>
      props.isDragging ? `calc(50% - 16px)` : `calc(50% - 20px)`};
    margin-left: ${props => (props.size === props.maxSize ? -12 : 4)}px;
  }

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
