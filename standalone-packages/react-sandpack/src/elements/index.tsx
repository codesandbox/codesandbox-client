import { styled } from '../stitches.config';

export const ErrorMessage = styled('pre', {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  margin: 0,
  overflow: 'auto',
  height: '100%',

  fontFamily: '$mono',
  backgroundColor: 'rgba(186, 53, 55, 0.7)',
  color: 'white',

  zIndex: 3,
});

export const SandpackWrapper = styled('div', {
  border: '1px solid $inactive',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  maxWidth: 1000,
  minHeight: 350,
  maxHeight: 700,
  borderRadius: '$default',
  fontSize: '$default',
  fontFamily: '$body',
  overflow: 'hidden',
  boxSizing: 'border-box',

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
