import React from 'react';
import { inject, observer } from 'mobx-react';

// @ts-ignore
import HeartIcon from '-!svg-react-loader!common/lib/icons/heart-open.svg'; // eslint-disable-line import/no-webpack-loader-syntax
// @ts-ignore
import FullHeartIcon from '-!svg-react-loader!common/lib/icons/heart.svg'; // eslint-disable-line import/no-webpack-loader-syntax

import Tooltip from 'common/lib/components/Tooltip';

import { Container } from './elements';
import { Sandbox } from 'common/lib/types';

const MaybeTooltip = ({ loggedIn, disableTooltip, title, children }) =>
  loggedIn && !disableTooltip ? (
    <Tooltip title={title} children={children} />
  ) : (
    children
  );

interface Props {
  sandbox: Sandbox;
  store: any;
  signals: any;
  className?: string;
  colorless?: boolean;
  text?: string;
  style?: React.CSSProperties;
  disableTooltip?: boolean;
  highlightHover?: boolean;
}

function LikeHeart({
  sandbox,
  store,
  signals,
  className,
  colorless,
  text,
  style,
  disableTooltip,
  highlightHover,
}: Props) {
  return (
    <Container
      style={style}
      hasText={text !== undefined}
      loggedIn={store.isLoggedIn}
      liked={sandbox.userLiked}
      className={className}
      highlightHover={highlightHover}
      onClick={
        store.isLoggedIn
          ? () => signals.editor.likeSandboxToggled({ id: sandbox.id })
          : null
      }
    >
      <MaybeTooltip
        loggedIn={store.isLoggedIn}
        disableTooltip={disableTooltip}
        title={sandbox.userLiked ? 'Undo like' : 'Like'}
      >
        {sandbox.userLiked ? (
          <FullHeartIcon style={colorless ? null : { color: '#E01F4E' }} />
        ) : (
          <HeartIcon />
        )}

        {text && <span>{text}</span>}
      </MaybeTooltip>
    </Container>
  );
}

export default inject('signals', 'store')(observer(LikeHeart));
