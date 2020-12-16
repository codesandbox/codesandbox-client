import { styled } from '../stitches.config';

export const ErrorMessage = styled('pre', {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  margin: 0,
  overflow: 'auto',
  height: '100%',

  fontFamily: 'Menlo, Source Code Pro, monospace',
  backgroundColor: 'rgba(186, 53, 55, 0.7)',
  color: 'white',

  padding: '0.5rem',
  zIndex: 3,
});

export const SandpackWrapper = styled('div', {
  border: '1px solid #EBEDF0',
  borderRadius: 4,
  overflow: 'hidden',
  maxWidth: 600,
});
