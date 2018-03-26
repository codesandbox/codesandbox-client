import React from 'react';
import styled, { css } from 'styled-components';

import RecordIcon from 'react-icons/lib/md/fiber-manual-record';

const styles = css`
  display: flex;
  align-items: center;
  justify-content: center;

  outline: none;
  border: none;
  padding: 0.5rem;

  background-color: #fd2439b8;

  width: 100%;
  color: white;
  border-radius: 4px;
  font-weight: 800;

  border: 2px solid #fd2439b8;
`;

const Button = styled.button`
  transition: 0.3s ease all;
  ${styles};
  cursor: pointer;

  svg {
    margin-right: 0.25rem;
  }

  &:hover {
    background-color: #fd2439fa;
  }
`;

const LoadingDiv = styled.div`
  ${styles};
`;

const AnimatedRecordIcon = styled(RecordIcon)`
  transition: 0.3s ease opacity;
`;

export default class LiveButton extends React.PureComponent {
  state = {
    hovering: false,
    showIcon: true,
  };

  timer: ?number;

  componentDidUpdate() {
    if (this.state.hovering && !this.timer) {
      this.timer = setInterval(() => {
        this.setState({ showIcon: !this.state.showIcon });
      }, 1000);
    } else if (!this.state.hovering && this.timer) {
      clearInterval(this.timer);
      this.timer = null;

      this.setState({ showIcon: true });
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  startHovering = () => {
    this.setState({ hovering: true });
  };

  stopHovering = () => {
    this.setState({ hovering: false });
  };

  render() {
    const { onClick, isLoading } = this.props;

    if (isLoading) {
      return <LoadingDiv>Creating Session</LoadingDiv>;
    }

    return (
      <Button
        onMouseEnter={this.startHovering}
        onMouseLeave={this.stopHovering}
        onClick={onClick}
      >
        <AnimatedRecordIcon style={{ opacity: this.state.showIcon ? 1 : 0 }} />{' '}
        Go Live
      </Button>
    );
  }
}
