// @flow
import * as React from 'react';
import { spring, Motion } from 'react-motion';
import styled from 'styled-components';
import theme from 'common/theme';

import Portal from '../components/Portal';

const Container = styled.div`
  position: fixed;

  font-size: 0.875rem;
  background-color: ${() => theme.background2.lighten(0.2)()};
  color: ${() => theme.background2.lighten(3)()};
  box-shadow: -1px 3px 4px rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  z-index: 20;
  overflow: hidden;

  transform-origin: 0% 0%;
`;

const Item = styled.div`
  transition: 0.3s ease all;
  padding: 0.75rem 1rem;

  border-bottom: 1px solid ${() => theme.background2()};
  border-left: 2px solid transparent;
  cursor: pointer;

  min-width: 10rem;

  svg {
    margin-right: 0.5rem;
  }

  &:last-child {
    border-bottom-color: transparent;
  }

  &:hover {
    color: ${props => (props.color ? props.color : theme.secondary())};
    background-color: ${() => theme.background2.lighten(0.3)()};
    border-left-color: ${props =>
      props.color ? props.color : theme.secondary()};
  }
`;

class ContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      show: false,
    };
  }
  onContextMenu = event => {
    this.mousedown = window.addEventListener('mousedown', mousedownEvent => {
      const { show } = this.props;

      if (show) {
        if (!this.el.contains(mousedownEvent.target)) {
          this.close();
        }
      }
    });

    this.keydown = window.addEventListener('keydown', keydownEvent => {
      const { show } = this.props;
      if (keydownEvent.keyCode === 27 && show) {
        // Escape
        this.close();
      }
    });

    this.setState({
      show: true,
      x: event.clientX + 10,
      y: event.clientY + 10,
    });
  };

  close = () => {
    window.removeEventListener(this.keydown);
    window.removeEventListener(this.mousedown);
    this.setState({
      show: false,
    });
  };

  render() {
    const { show, children, items } = this.props;

    return (
      <div
        ref={el => {
          this.el = el;
        }}
        onContextMenu={this.onContextMenu}
      >
        {children}
        <Portal>
          <div>
            {show && (
              <Motion
                defaultStyle={{ size: 0.75, opacity: 0.6 }}
                style={{
                  size: spring(1, { stiffness: 200, damping: 26 }),
                  opacity: spring(1),
                }}
              >
                {({ size, opacity }) => (
                  <Container
                    style={{
                      left: this.state.x,
                      top: this.state.y,
                      transform: `scale(${size}, ${size})`,
                      opacity,
                    }}
                  >
                    <div>
                      {items.map(item => (
                        <Item
                          key={item.key}
                          color={item.color}
                          onClick={() => item.onClick()}
                        >
                          {item.icon && <item.icon />}
                          {item.title}
                        </Item>
                      ))}
                    </div>
                  </Container>
                )}
              </Motion>
            )}
          </div>
        </Portal>
      </div>
    );
  }
}

export default ContextMenu;
