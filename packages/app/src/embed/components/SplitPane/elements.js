import styled, { css, keyframes } from 'styled-components';

const introduction = {
  slideFromLeft: keyframes(css`
    0% {
      margin-left: -12px;
      background: #fff;
      opacity: 1;
    }
    50% {
      margin-left: 12px;
      background: #fff;
      opacity: 1;
    }
    100% {
      margin-left: 4px;
      background: #fff;
      opacity: 1;
    }
  `),
  slideFromRight: keyframes(css`
    0% {
      margin-left: 4px;
      background: #fff;
      opacity: 1;
    }
    50% {
      margin-left: -20px;
      background: #fff;
      opacity: 1;
    }
    100% {
      margin-left: -12px;
      background: #fff;
      opacity: 1;
    }
  `),
  fade: keyframes(css`
    0% {
      opacity: 1;
      background: #fff;
    }
    100% {
      opacity: 0.6;
      background: #242424;
    }
  `),
};

const notIntroducedYetStyles = css`
  margin-left: ${props => (props.fullSize ? 4 : -12)}px;
  background: #fff;
  opacity: 1;
`;

const introductionAnimation = css`
  animation: ${props =>
        props.fullSize
          ? introduction.slideFromRight
          : introduction.slideFromLeft}
      1s,
    ${introduction.fade} 1s 1s;
  animation-fill-mode: forwards, forwards;
`;

export const Container = styled.div`
  width: 100%;
  height: 100%;

  .Resizer {
    z-index: 99;
    /* Safari, sigh.
      Quote: We recently encountered this and discovered that promoting the
      affected element to a composite layer with translateZ in CSS fixed
      the issue without needing extra JavaScript.
      — https://stackoverflow.com/a/21947628/1501871
    */
    transform: translateZ(0);
  }

  .Resizer::after {
    content: '';
    background: #242424;
    border-radius: 50px;
    border: 1px solid #fff;
    transition: margin 500ms, height 150ms, top 150ms ease;
    position: absolute;

    width: 5px;
    height: ${props => (props.isDragging ? 32 : 40)}px;
    top: ${props =>
      props.isDragging ? `calc(50% - 16px)` : `calc(50% - 20px)`};
    margin-left: ${props => (props.fullSize ? -12 : 4)}px;
    opacity: ${props => (props.isDragging ? 0.6 : 0.4)};

    /* intro animations */
    ${props => {
      if (props.hasBeenIntroduced) return null;
      if (props.hasAttention) return introductionAnimation;
      return notIntroducedYetStyles;
    }}
  }

  .Resizer:hover::after {
    opacity: 0.6;
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

  .Resizer {
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
