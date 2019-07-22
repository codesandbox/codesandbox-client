import Tooltip from '@codesandbox/common/lib/components/Tooltip';
// @ts-ignore
import FullHeartIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/heart.svg'; // eslint-disable-line import/no-webpack-loader-syntax
// @ts-ignore
import HeartIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/heart-open.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import { Sandbox } from '@codesandbox/common/lib/types';
import noop from 'lodash/noop';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStore, useSignals } from 'app/store';

import { Container } from './elements';

const MaybeTooltip = ({ loggedIn, disableTooltip, title, children }) =>
  loggedIn && !disableTooltip ? (
    <Tooltip content={title} style={{ display: 'flex' }}>
      {children}
    </Tooltip>
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

const LikeHeart = observer<Props>(
  ({
    sandbox,
    className,
    colorless,
    text,
    style,
    disableTooltip,
    highlightHover,
  }) => {
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
          isLoggedIn
            ? () => editor.likeSandboxToggled({ id: sandbox.id })
            : noop
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
);

export default LikeHeart;
