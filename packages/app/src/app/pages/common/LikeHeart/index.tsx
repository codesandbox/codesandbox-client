import { Sandbox } from '@codesandbox/common/lib/types';
import React, { ComponentProps, FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

// @ts-ignore
import HeartIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/heart-open.svg'; // eslint-disable-line import/no-webpack-loader-syntax
// @ts-ignore
import FullHeartIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/heart.svg'; // eslint-disable-line import/no-webpack-loader-syntax

import { Container } from './elements';
import { MaybeTooltip } from './MaybeTooltip';

const noop = () => undefined;

type Props = {
  colorless?: boolean;
  sandbox: Sandbox;
  text?: number;
} & Pick<ComponentProps<typeof MaybeTooltip>, 'disableTooltip'> &
  Pick<
    ComponentProps<typeof Container>,
    'className' | 'highlightHover' | 'style'
  >;
export const LikeHeart: FunctionComponent<Props> = ({
  className,
  colorless,
  disableTooltip,
  highlightHover,
  sandbox,
  style,
  text,
}) => {
  const {
    actions: {
      editor: { likeSandboxToggled },
    },
    state: { isLoggedIn },
  } = useOvermind();

  return (
    <Container
      className={className}
      hasText={text !== undefined}
      highlightHover={highlightHover}
      liked={sandbox.userLiked}
      loggedIn={isLoggedIn}
      onClick={isLoggedIn ? () => likeSandboxToggled(sandbox.id) : noop}
      style={style}
    >
      <MaybeTooltip
        disableTooltip={disableTooltip}
        loggedIn={isLoggedIn}
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
};
