import styled from 'styled-components';
import css from '@styled-system/css';
import { HeartIconSVG, ReloadIconSVG, NewWindowIconSVG } from './icons';

// TODO: Check if we still need previewVisible
export const Container = styled.div(props =>
  css({
    position: 'absolute',
    bottom: props.previewVisible ? 28 + 16 : 16,
    [props.align]: 16,
    zIndex: 99,

    display: 'flex',
    // margin between consecutive elements
    '* + *': {
      marginLeft: 1,
    },

    opacity: props.isDragging ? 0 : 1,
    transition: 'opacity 200ms',
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
      svg: {
        color: 'white',
      },
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

export const ReloadIcon = styled(ReloadIconSVG)(
  css({
    color: 'grays.400',
  })
);
export const NewWindowIcon = styled(NewWindowIconSVG)(
  css({
    color: 'grays.400',
  })
);
