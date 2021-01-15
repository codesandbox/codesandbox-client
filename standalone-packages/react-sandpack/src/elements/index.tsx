import { styled } from '../stitches.config';

export const Button = styled('button', {
  appearance: 'none',
  border: '0',
  padding: '$1 $3 $1 $2',
  borderRadius: '$default',
  display: 'flex',
  alignItems: 'center',
  color: '$defaultText',
  backgroundColor: '$mainBackground',
  outline: 'none',
  fontSize: '$default',
  fontFamily: '$body',
  transition: 'all 0.15s ease-in-out',

  ':hover:not(:disabled)': {
    backgroundColor: '$inactive',
    color: '$highlightText',
  },
  ':disabled': { color: '$inactive' },
  ':focus-visible': { outline: 'auto' },
});

export const ErrorMessage = styled('pre', {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  margin: 0,
  overflow: 'auto',
  height: '100%',
  padding: '$4',

  fontFamily: '$mono',
  backgroundColor: '$error',
  color: 'white',

  zIndex: 3,
});
