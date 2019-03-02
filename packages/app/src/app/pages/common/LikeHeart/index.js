import React from 'react';
import { inject, observer } from 'mobx-react';

import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import Tooltip from 'common/lib/components/Tooltip';

import { Container } from './elements';

const MaybeTooltip = ({ loggedIn, ...props }) =>
  loggedIn ? <Tooltip {...props} /> : <div {...props} />;

function LikeHeart({ sandbox, store, signals, className, colorless }) {
  return (
    <Container loggedIn={store.isLoggedIn} className={className}>
      <MaybeTooltip
        loggedIn={store.isLoggedIn}
        title={sandbox.userLiked ? 'Undo like' : 'Like'}
      >
        {sandbox.userLiked ? (
          <FullHeartIcon
            style={colorless ? null : { color: '#E01F4E' }}
            onClick={
              store.isLoggedIn
                ? () => signals.editor.likeSandboxToggled({ id: sandbox.id })
                : null
            }
          />
        ) : (
          <HeartIcon
            onClick={
              store.isLoggedIn
                ? () => signals.editor.likeSandboxToggled({ id: sandbox.id })
                : null
            }
          />
        )}
      </MaybeTooltip>
    </Container>
  );
}

export default inject('signals', 'store')(observer(LikeHeart));
