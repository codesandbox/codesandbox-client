import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Portal from '@codesandbox/common/lib/components/Portal';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';

import { Spring, animated } from 'react-spring/renderprops';

const NoScroll = createGlobalStyle`
  html {
    overflow: hidden;
  }
`;

const Container = styled(animated.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
  z-index: 10;

  background-color: rgba(0, 0, 0, 0.5);

  display: ${props => (props.isOpen ? 'flex' : 'none')};

  justify-content: center;
`;

const Content = styled.div`
  width: 1000px;
  margin-top: 5%;
  z-index: 20;
  max-width: 90%;
`;

export default class Modal extends React.PureComponent {
  componentDidMount() {
    window.addEventListener('keydown', this.listenForEsc);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.listenForEsc);
  }

  listenForEsc = e => {
    if (e.keyCode === ESC) {
      this.props.onClose();
    }
  };

  render() {
    const { children } = this.props;
    return (
      <Portal>
        {this.props.isOpen && <NoScroll />}
        <Spring
          from={{ opacity: 0 }}
          to={{ opacity: this.props.isOpen ? 1 : 0 }}
          config={{ tension: 240, velocity: 10 }}
          native
        >
          {props => (
            <Container
              role="dialog"
              aria-modal="true"
              style={props}
              onClick={this.props.onClose}
              isOpen={this.props.isOpen}
            >
              <Content
                onClick={e => {
                  if (e) {
                    e.stopPropagation();
                  }
                }}
              >
                {children}
              </Content>
            </Container>
          )}
        </Spring>
      </Portal>
    );
  }
}
