import { styled } from '../stitches.config';

export const SandpackLayout = styled('div', {
  border: '1px solid $inactive',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  width: '100%',
  maxWidth: 1000,
  minHeight: 350,
  maxHeight: 700,
  borderRadius: '$default',
  fontSize: '$default',
  fontFamily: '$body',
  overflow: 'hidden',
  boxSizing: 'border-box',

  textRendering: 'optimizeLegibility',
  WebkitTapHighlightColor: 'transparent',
  WebkitTouchCallout: 'none',
  WebkitFontSmoothing: 'subpixel-antialiased',

  '@media screen and (min-resolution: 2dppx)': {
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },

  '& > *': {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    width: 0,
    minWidth: 300,
  },

  '*': {
    boxSizing: 'border-box',
  },
});
