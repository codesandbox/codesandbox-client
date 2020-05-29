// @ts-ignore
// @ts-ignore
import { Sandbox } from '@codesandbox/common/es/types';
import { useOvermind } from 'app/overmind';
import React, { ComponentProps, FunctionComponent } from 'react';
import { StyledComponentInnerOtherProps } from 'styled-components';
import FullHeartIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/heart.svg'; // eslint-disable-line import/no-webpack-loader-syntax
import HeartIcon from '-!svg-react-loader!@codesandbox/common/lib/icons/heart-open.svg'; // eslint-disable-line import/no-webpack-loader-syntax

import { Container } from './elements';
import { MaybeTooltip } from './MaybeTooltip';

const noop = () => undefined;

type Props = {
  colorless?: boolean;
  sandbox: Sandbox;
  text?: number;
  className?: string;
  style?: React.CSSProperties;
} & Partial<Pick<ComponentProps<typeof MaybeTooltip>, 'disableTooltip'>> &
  Pick<StyledComponentInnerOtherProps<typeof Container>, 'highlightHover'>;

export const LikeHeart: FunctionComponent<Props> = ({
  className,
  colorless,
  disableTooltip,
  highlightHover = false,
  sandbox: { id, userLiked },
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
      liked={userLiked}
      loggedIn={isLoggedIn}
      onClick={isLoggedIn ? () => likeSandboxToggled(id) : noop}
      style={style}
    >
      <MaybeTooltip
        disableTooltip={disableTooltip}
        loggedIn={isLoggedIn}
        title={userLiked ? 'Undo like' : 'Like'}
      >
        {userLiked ? (
          <FullHeartIcon style={colorless ? {} : { color: '#E01F4E' }} />
        ) : (
          <HeartIcon />
        )}

        {text && <span>{text}</span>}
      </MaybeTooltip>
    </Container>
  );
};
