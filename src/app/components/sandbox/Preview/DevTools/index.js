// @flow
import React from 'react';
// import { throttle } from 'lodash';
import styled from 'styled-components';

import Unread from './Unread';

import Console from './Console';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${props => props.theme.background};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  height: 2rem;
  min-height: 2rem;
  background-color: ${props => props.theme.background2};
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);

  box-shadow: 0 0 3px rgba(0, 0, 0, 0.6);

  cursor: row-resize;
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
  padding: 0 1rem;
  background-color: ${props => props.theme.background};
  border-right: 1px solid rgba(0, 0, 0, 0.3);
`;

export type Status = {
  unread: number,
  type: 'info' | 'warning' | 'error',
};

type Props = {
  setDragging: (dragging: boolean) => void,
};
type State = {
  consoleStatus: Status,
  height: number,
  mouseDown: boolean,
  hidden: boolean,
  startY: number,
  startHeight: number,
};

function unFocus(document, window) {
  if (document.selection) {
    document.selection.empty();
  } else {
    try {
      window.getSelection().removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

export default class DevTools extends React.PureComponent<Props, State> {
  state = {
    consoleStatus: {
      unread: 0,
      type: 'info',
    },

    mouseDown: false,
    startY: 0,
    startHeight: 0,

    hidden: true,

    height: 2 * 16,
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.handleMouseUp, false);
    document.addEventListener('mousemove', this.handleMouseMove, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleMouseUp, false);
    document.removeEventListener('mousemove', this.handleMouseMove, false);
  }

  setHidden = (hidden: boolean) => {
    if (!hidden) {
      return this.setState({
        consoleStatus: {
          unread: 0,
          type: 'info',
        },
        hidden: false,
      });
    }

    return this.setState({ hidden });
  };

  updateStatus = (status: 'warning' | 'error' | 'info') => {
    if (!this.state.hidden) {
      return;
    }

    const currentStatus = this.state.consoleStatus;
    let newStatus = currentStatus.type;

    if (status === 'warning' && newStatus !== 'error') {
      newStatus = 'warning';
    } else if (status === 'error') {
      newStatus = 'error';
    }

    this.setState({
      consoleStatus: {
        type: newStatus,
        unread: this.state.consoleStatus.unread + 1,
      },
    });
  };

  handleMouseDown = (event: MouseEvent) => {
    if (!this.state.mouseDown) {
      unFocus(document, window);
      this.setState({
        startY: event.clientY,
        startHeight: this.state.height,
        mouseDown: true,
      });
      this.props.setDragging(true);
    }
  };

  handleMouseUp = () => {
    if (this.state.mouseDown) {
      this.setState({ mouseDown: false });
      this.props.setDragging(false);

      // We do this to force a recalculation of the iframe height, this doesn't
      // happen when pointer events are disabled and in turn disables scroll.
      // It's hacky, but it's to fix a bug in the browser.
      setTimeout(() => {
        this.setState({ height: this.state.height + 1 });
      }, 50);
    }
  };

  handleMouseMove = (event: MouseEvent) => {
    if (this.state.mouseDown) {
      const newHeight =
        this.state.startHeight - (event.clientY - this.state.startY);

      this.setState({
        height: Math.max(32, newHeight),
      });
      this.setHidden(newHeight < 48);
    }
  };

  node: HTMLElement;

  render() {
    const { consoleStatus, hidden, height } = this.state;

    return (
      <Container
        innerRef={el => {
          this.node = el;
        }}
        style={{
          height,
          minHeight: height,
          position: 'relative',
          display: 'flex',
        }}
      >
        <Header draggable="true" onMouseDown={this.handleMouseDown}>
          <Tab>
            Console
            {consoleStatus.unread > 0 && (
              <Unread
                status={consoleStatus.type}
                unread={consoleStatus.unread}
              />
            )}
          </Tab>
        </Header>

        <Console hidden={hidden} updateStatus={this.updateStatus} />
      </Container>
    );
  }
}
