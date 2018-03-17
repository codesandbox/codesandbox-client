import * as React from 'react';
import { connect } from 'app/fluent'
import { Sandbox } from 'app/store/modules/editor/types'
import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';
import Tooltip from 'common/components/Tooltip';

import { Container } from './elements';

type Props = {
  sandbox: Sandbox
  className?: string
  colorless?: boolean
}

const MaybeTooltip = ({ loggedIn, ...props }) =>
  loggedIn ? <Tooltip {...props} /> : <div {...props} />;

export default connect<Props>()
  .with(({ state, signals }) => ({
    isLoggedIn: state.isLoggedIn,
    likeSandboxToggled: signals.editor.likeSandboxToggled
  }))
  .to(
    function LikeHeart({ sandbox, isLoggedIn, likeSandboxToggled, className, colorless }) {
      return (
        <Container loggedIn={isLoggedIn} className={className}>
          <MaybeTooltip
            loggedIn={isLoggedIn}
            title={sandbox.userLiked ? 'Undo like' : 'Like'}
          >
            {sandbox.userLiked ? (
              <FullHeartIcon
                style={colorless ? null : { color: '#E01F4E' }}
                onClick={
                  isLoggedIn
                    ? () => likeSandboxToggled({ id: sandbox.id })
                    : null
                }
              />
            ) : (
              <HeartIcon
                onClick={
                  isLoggedIn
                    ? () => likeSandboxToggled({ id: sandbox.id })
                    : null
                }
              />
            )}
          </MaybeTooltip>
        </Container>
      );
    }
  )
