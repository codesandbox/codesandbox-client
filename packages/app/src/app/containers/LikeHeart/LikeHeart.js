import React from 'react';
import styled, { css } from 'styled-components';
import HeartIcon from 'react-icons/lib/fa/heart-o';
import FullHeartIcon from 'react-icons/lib/fa/heart';

import Tooltip from 'app/components/Tooltip';

type Props = {
  isLiked: boolean,
  loggedIn: boolean,
  likeSandbox: Function,
  unLikeSandbox: Function,
  sandboxId: string,
  className: ?string,
  colorless: boolean,
};

type MaybeTooltipProps = {
  loggedIn: boolean,
};

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

const MaybeTooltip = ({ loggedIn, ...props }: MaybeTooltipProps) =>
  loggedIn ? <Tooltip {...props} /> : <div {...props} />;

export default class LikeHeart extends React.PureComponent {
  props: Props;

  likeSandbox = () => {
    this.props.likeSandbox(this.props.sandboxId);
  };

  unlikeSandbox = () => {
    this.props.unLikeSandbox(this.props.sandboxId);
  };

  render() {
    const { isLiked, colorless, loggedIn, className } = this.props;

    return (
      <Container loggedIn={loggedIn} className={className}>
        <MaybeTooltip
          loggedIn={loggedIn}
          title={isLiked ? 'Undo like' : 'Like'}
        >
          {isLiked ? (
            <FullHeartIcon
              style={!colorless && { color: '#E01F4E' }}
              onClick={loggedIn ? this.unlikeSandbox : null}
            />
          ) : (
            <HeartIcon onClick={loggedIn ? this.likeSandbox : null} />
          )}
        </MaybeTooltip>
      </Container>
    );
  }
}
