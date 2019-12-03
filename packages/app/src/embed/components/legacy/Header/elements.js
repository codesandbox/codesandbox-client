import styled from 'styled-components';
import css from '@styled-system/css';

import {
  MenuIconSVG,
  HeartIconSVG,
  LinkIconSVG,
  PreviewViewIconSVG,
  EditorViewIconSVG,
  SplitViewIconSVG,
} from './icons';

import { SIDEBAR_SHOW_SCREEN_SIZE } from '../../../util/constants';

export const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 0 1rem;
  box-sizing: border-box;
  background-color: ${props => props.theme['editor.background']};

  /* compatibility mode for the redesign */
  height: calc(32px + 1px);
  border-bottom: 1px solid ${props => props.theme['sideBar.border']};
`;

export const LeftAligned = styled.div`
  position: relative;
  display: flex;
  width: calc(50% - 100px);
  height: 100%;
  align-items: center;
  justify-content: flex-start;

  @media (min-width: ${SIDEBAR_SHOW_SCREEN_SIZE}px) {
    svg {
      visibility: hidden;
      display: none;
    }
  }
`;

export const CenterAligned = styled.div`
  position: relative;
  display: flex;
  width: 200px;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const RightAligned = styled.div`
  position: relative;
  display: flex;
  width: calc(50% - 100px);
  height: 100%;
  align-items: center;
  justify-content: flex-end;
`;

export const Title = styled.div`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;

  /* compatibility mode for the redesign */
  font-size: 13px;

  @media (min-width: ${SIDEBAR_SHOW_SCREEN_SIZE}px) {
    display: none;
  }

  @media (max-width: 450px) {
    display: none;
  }
`;

export const OnlyShowWideText = styled.span`
  margin-left: 0.4rem;
  @media (max-width: ${props => props.hideOn || 400}px) {
    display: none;
  }
`;

export const Button = styled.button(
  css({
    // reset button properties
    background: 'transparent',
    border: 'none',

    color: 'grays.400',

    height: '100%',
    display: 'flex',
    alignItems: 'center',

    paddingX: 2,
    cursor: 'pointer',

    '&:hover': {
      svg: {
        color: 'white',
      },
    },
  })
);

export const MenuIcon = styled(MenuIconSVG)(
  css({
    color: 'tab.activeForeground',
    marginRight: 2,
    cursor: 'pointer',
    zIndex: 10,
  })
);

export const LinkIcon = styled(LinkIconSVG)(css({}));

export const HeartButton = styled(Button)(props =>
  css({
    '&:hover': {
      svg: {
        color: props.liked ? 'reds.300' : 'white',
      },
    },
  })
);

export const HeartIcon = styled(HeartIconSVG)(props =>
  css({
    color: props.liked ? 'reds.300' : 'grays.400',
  })
);

const ModeStyleStyles = props =>
  css({
    color: props.active ? 'white' : 'grays.400',
    borderRadius: 2,
    cursor: 'pointer',
    marginX: 1,
    ':hover': {
      color: 'white',
    },
    path: {
      transitionProperty: 'fill',
      transitionDuration: theme => theme.speed[2],
    },
  });

export const EditorViewIcon = styled(EditorViewIconSVG)(ModeStyleStyles);
export const SplitViewIcon = styled(SplitViewIconSVG)(ModeStyleStyles);
export const PreviewViewIcon = styled(PreviewViewIconSVG)(ModeStyleStyles);
