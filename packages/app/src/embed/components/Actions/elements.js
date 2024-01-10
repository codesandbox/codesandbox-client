import styled from 'styled-components';
import css from '@styled-system/css';
import { CodeSandboxIcon as CodeSandboxIconBase } from '@codesandbox/common/lib/components/icons/CodeSandbox';
import { PreviewIcon as PreviewIconBase } from '@codesandbox/common/lib/components/icons/Preview';
import { HeartIconSVG, ReloadIconSVG, NewWindowIconSVG } from './icons';

export const Container = styled.div(props => {
  let bottom; // 28 is the height of console
  if (props.isDragging) {
    bottom = -32;
  } else {
    bottom = props.offsetBottom ? 28 + 16 : 16;
  }

  return css({
    position: 'absolute',
    [props.align]: 16,
    zIndex: 99,

    display: 'flex',
    // margin between consecutive elements
    '* + *': {
      marginLeft: 1,
    },

    bottom,
    opacity: props.isDragging ? 0 : 1,
    transitionProperty: 'opacity, bottom',
    transitionDuration: theme =>
      // go out fast, come back slow
      props.isDragging ? theme.speed[3] : theme.speed[5],
  });
});

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
    borderColor: 'grays.600',
    color: 'white',
    backgroundColor: 'grays.700',
    borderRadius: 4,
    textDecoration: 'none',
    cursor: 'pointer',

    ':hover': {
      backgroundColor: 'grays.600',
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

export const IconButton = styled(Button)`
  padding: 0 3px;
`;

export const CodeSandboxIcon = styled(CodeSandboxIconBase)(() =>
  css({
    fontSize: 28,
  })
);
export const PreviewIcon = styled(PreviewIconBase)(() =>
  css({
    fontSize: 28,
  })
);

export const ReloadIcon = ReloadIconSVG;
export const NewWindowIcon = NewWindowIconSVG;
