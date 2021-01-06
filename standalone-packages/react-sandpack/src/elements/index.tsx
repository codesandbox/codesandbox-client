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

  padding: '0.5rem',
  zIndex: 3,
});

export const SandpackWrapper = styled('div', {
  border: '1px solid $neutral800',
  display: 'flex',
  width: '100%',
  height: '100%',
  borderRadius: '$default',
  fontSize: '$1',
  fontFamily: '$body',
  overflow: 'hidden',
  maxWidth: 800,

  '*': {
    boxSizing: 'border-box',
  },
});
