import React from 'react';
import { observer } from 'mobx-react-lite';

// @ts-ignore
import HeartIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/heart-open.svg'; // eslint-disable-line import/no-webpack-loader-syntax
// @ts-ignore
import FullHeartIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/heart.svg'; // eslint-disable-line import/no-webpack-loader-syntax

import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import { Container } from './elements';
import { Sandbox } from '@codesandbox/common/lib/types';
import { useStore, useSignals } from 'app/store';

const MaybeTooltip = ({ loggedIn, disableTooltip, title, children }) =>
  loggedIn && !disableTooltip ? (
    <Tooltip content={title} children={children} style={{ display: 'flex' }} />
  ) : (
    children
  );

interface Props {
  sandbox: Sandbox;
  className?: string;
  colorless?: boolean;
  text?: string;
  style?: React.CSSProperties;
  disableTooltip?: boolean;
  highlightHover?: boolean;
}

function LikeHeart({
  sandbox,
  className,
  colorless,
  text,
  style,
  disableTooltip,
  highlightHover,
}: Props) {
  const { isLoggedIn } = useStore();
  const { editor } = useSignals();

  return (
    <Container
      style={style}
      hasText={text !== undefined}
      loggedIn={isLoggedIn}
      liked={sandbox.userLiked}
      className={className}
      highlightHover={highlightHover}
      onClick={
        isLoggedIn ? () => editor.likeSandboxToggled({ id: sandbox.id }) : null
      }
    >
      <MaybeTooltip
        loggedIn={isLoggedIn}
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

export default observer(LikeHeart);
