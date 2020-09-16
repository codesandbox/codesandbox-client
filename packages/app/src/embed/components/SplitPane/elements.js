import styled from 'styled-components';

export const RESIZER_WIDTH = 16;
export const KNOB_WIDTH = 4;
/**
 * We leave a bit more room for the user to grab around the resize area, this defines
 * how much room that actually is
 */
export const RESIZER_GRAB_EXTRA_WIDTH = 4;

export const Container = styled.div`
  width: 100%;
  height: 100%;

  .Resizer {
    /* Safari, sigh.
      Quote: We recently encountered this and discovered that promoting the
      affected element to a composite layer with translateZ in CSS fixed
      the issue without needing extra JavaScript.
      — https://stackoverflow.com/a/21947628/1501871
    */
    transform: translateZ(0);

    background-color: ${props => props.theme.colors.separator.background};
    width: ${RESIZER_WIDTH}px;
    display: block;
    height: 100%;
    cursor: ew-resize;
    z-index: 50;
  }

  .Resizer::after {
    content: '';
    display: flex;
    background: ${props => props.theme.colors.separator.foreground};
    border-radius: 50px;
    position: absolute;

    width: ${KNOB_WIDTH}px;
    height: 41px;
    top: calc(50% - 20px);
    margin-left: ${Math.floor(RESIZER_WIDTH / 2 - KNOB_WIDTH / 2)}px;
    opacity: 1;
  }

  .Resizer::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    margin-left: -${RESIZER_GRAB_EXTRA_WIDTH}px;
    width: ${RESIZER_WIDTH + RESIZER_GRAB_EXTRA_WIDTH * 2}px;
    z-index: 50;
  }

  .Pane {
    transition: ${props => (props.isDragging ? null : 'width 200ms ease')};
    overflow: hidden;
  }

  /*
    When previewwindow=tests, SplitPane takes the above styles and the
    resizer between Test and Test Summary appears vertical. Below styles
    override the resizer to appear horizontally.

    Note: Better fix will be injecting a custom className to resizer and
    adding the styles based on className. ( SplitPane doesnt accept className prop )
  */
  .Pane .Resizer {
    width: 100%;
    height: ${RESIZER_WIDTH}px;
    cursor: ns-resize;
  }

  .Pane .Resizer::after {
    width: 41px;
    height: ${KNOB_WIDTH}px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const PaneContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
