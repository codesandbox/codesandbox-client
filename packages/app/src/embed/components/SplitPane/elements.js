import styled from 'styled-components';

export const RESIZER_WIDTH = 16;
export const KNOB_WIDTH = 4;
/**
 * We leave a bit more room for the user to grab around the resize area, this defines
 * how much room that actually is
 */
export const RESIZER_GRAB_EXTRA_WIDTH = 4;

const getKnobSizeKey = props => (props.verticalMode ? 'height' : 'width');
const getKnobHeightKey = props => (props.verticalMode ? 'width' : 'height');
const getContainerSizeKey = props => (props.verticalMode ? 'width' : 'height');
const getKnobOffsetKey = props => (props.verticalMode ? 'left' : 'top');
const getKnobMarginKey = props =>
  props.verticalMode ? 'margin-top' : 'margin-left';

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
    ${getKnobSizeKey}: ${RESIZER_WIDTH}px;
    display: block;
    ${getContainerSizeKey}: 100%;
    cursor: ${props => (props.verticalMode ? 'ns-resize' : 'ew-resize')};
    z-index: 50;
  }

  .Resizer::after {
    content: '';
    display: flex;
    background: ${props => props.theme.colors.separator.foreground};
    border-radius: 50px;
    position: absolute;

    ${getKnobSizeKey}: ${KNOB_WIDTH}px;
    ${getKnobHeightKey}: 41px;
    ${getKnobOffsetKey}: calc(50% - 20px);
    ${getKnobMarginKey}: ${Math.floor(RESIZER_WIDTH / 2 - KNOB_WIDTH / 2)}px;
    opacity: 1;
  }

  .Resizer::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    ${getKnobMarginKey}: -${RESIZER_GRAB_EXTRA_WIDTH}px;
    ${getKnobSizeKey}: ${RESIZER_WIDTH + RESIZER_GRAB_EXTRA_WIDTH * 2}px;
    z-index: 50;
  }

  .Pane {
    transition: ${props =>
      props.isDragging
        ? null
        : `${props.verticalMode ? 'height' : 'width'} 200ms ease`};
    overflow: hidden;
  }
`;

export const PaneContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;
