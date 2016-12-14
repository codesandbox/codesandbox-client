// @flow
import React from 'react';
import { bindActionCreators } from 'redux';
import { spring, Motion } from 'react-motion';
import styled from 'styled-components';
import { connect } from 'react-redux';
import theme from '../../common/theme';

import type { ContextMenuState } from '../store/reducers/context-menu';
import contextMenuActionCreators from '../store/actions/context-menu';
import Portal from '../components/Portal';

const Container = styled.div`
  position: fixed;

  font-size: .875rem;
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
  padding: .75rem 1rem;

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
    border-left-color: ${props => (props.color ? props.color : theme.secondary())};
  }
`;

type Props = {
  contextMenu: ContextMenuState;
  contextMenuActions: typeof contextMenuActionCreators;
};

const mapStateToProps = state => ({
  contextMenu: state.contextMenu,
});
const mapDispatchToProps = dispatch => ({
  contextMenuActions: bindActionCreators(contextMenuActionCreators, dispatch),
});
class ContextMenu extends React.PureComponent {
  interval: number;
  props: Props;

  setup = (el) => {
    this.mousedown = window.addEventListener('mousedown', (event) => {
      const { contextMenu } = this.props;

      if (contextMenu.show) {
        if (!el.contains(event.target)) {
          this.close();
        }
      }
    });

    this.keydown = window.addEventListener('keydown', (event) => {
      const { contextMenu } = this.props;
      if (event.keyCode === 27 && contextMenu.show) {
        // Escape
        this.close();
      }
    });
  };

  mousedown: ?Function;
  keydown: ?Function;

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.mousedown);
    window.removeEventListener('keydown', this.keydown);
  }

  close = () => {
    const { contextMenu, contextMenuActions } = this.props;
    if (contextMenu.onClose) contextMenu.onClose();
    contextMenuActions.closeMenu();
  }

  render() {
    const { contextMenu } = this.props;
    return (
      <Portal>
        <div ref={this.setup}>
          {contextMenu.show &&
            <Motion
              defaultStyle={{ size: 0.75, opacity: 0.6 }}
              style={{ size: spring(1, { stiffness: 200, damping: 26 }), opacity: spring(1) }}
            >
              {({ size, opacity }) => (
                <Container
                  style={{
                    left: contextMenu.x + 10,
                    top: contextMenu.y + 10,
                    transform: `scale(${size}, ${size})`,
                    opacity,
                  }}
                >
                  <div>
                    {contextMenu.items.map(item => (
                      <Item
                        key={item.title}
                        color={item.color}
                        onClick={() => item.action() && this.close()}
                      >
                        {item.icon && <item.icon />}
                        {item.title}
                      </Item>
                    ))}
                  </div>
                </Container>
              )}
            </Motion>}
        </div>
      </Portal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
