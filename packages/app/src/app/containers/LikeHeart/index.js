import React from 'react';
import { inject, observer } from 'mobx-react';
import styled, { css } from 'styled-components';
import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import Tooltip from 'common/components/Tooltip';

const Container = styled.div`
  display: inline-block;
  transition: 0.3s ease all;

  transform: scale(1);

  ${props =>
    props.loggedIn &&
    css`
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
    `};
`;

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
