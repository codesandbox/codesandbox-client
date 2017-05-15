import React from 'react';
import styled from 'styled-components';
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
};

const Container = styled.div`
  display: inline-block;
  transition: 0.3s ease all;

  cursor: pointer;

  transform: scale(1);

  &:hover {
    transform: scale(1.1);
    color: #E01F4E;
  }
`;

export default class LikeHeart extends React.PureComponent {
  props: Props;

  likeSandbox = () => {
    this.props.likeSandbox(this.props.sandboxId);
  };

  unlikeSandbox = () => {
    this.props.unLikeSandbox(this.props.sandboxId);
  };

  render() {
    const { isLiked, loggedIn, className } = this.props;

    if (!loggedIn) return null;

    return (
      <Container className={className}>
        <Tooltip title={isLiked ? 'Undo like' : 'Like'}>
          {isLiked
            ? <FullHeartIcon
                style={{ color: '#E01F4E' }}
                onClick={this.unlikeSandbox}
              />
            : <HeartIcon onClick={this.likeSandbox} />}
        </Tooltip>
      </Container>
    );
  }
}
