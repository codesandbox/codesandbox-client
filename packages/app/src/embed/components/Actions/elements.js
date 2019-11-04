import styled from 'styled-components';
import css from '@styled-system/css';
import { HeartIconSVG } from './icons';

// TODO: Check if we still need previewVisible
export const Container = styled.div(props =>
  css({
    position: 'absolute',
    bottom: props.previewVisible ? 32 + 16 : 16,
    [props.align]: 16,
    zIndex: 99,

    display: 'flex',
    // margin between consecutive elements
    '* + *': {
      marginLeft: 1,
    },
  })
);

export const Button = styled.button(
  css({
    display: 'inline-flex',
    alignItems: 'center',
    height: 32,
    paddingX: 3,
    paddingY: 0,

    fontSize: 3,
    fontWeight: 'medium',
    border: '1px solid',
    borderColor: 'grays.500',
    color: 'white',
    backgroundColor: 'grays.700',
    borderRadius: 4,
    textDecoration: 'none',
    cursor: 'pointer',

    ':hover': {
      backgroundColor: 'grays.500',
    },
  })
);

export const HeartIcon = styled(HeartIconSVG)(props =>
  css({
    path: {
      stroke: props.liked ? 'reds.300' : 'white',
      fill: props.liked ? 'reds.300' : 'none',
    },
  })
);
