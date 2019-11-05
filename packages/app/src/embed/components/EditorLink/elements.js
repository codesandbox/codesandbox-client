import styled from 'styled-components';
import css from '@styled-system/css';

export const Button = styled.a(props =>
  css({
    position: 'absolute',
    bottom: props.previewVisible ? 32 + 16 : 16,
    right: 16,
    zIndex: 99,

    fontSize: 3,
    lineHeight: '32px',
    fontWeight: 'medium',
    border: '1px solid',
    borderColor: 'grays.500',
    color: 'white',
    backgroundColor: 'grays.700',
    borderRadius: 4,
    paddingX: 3,
    textDecoration: 'none',

    ':hover': {
      backgroundColor: 'grays.500',
    },
  })
);
