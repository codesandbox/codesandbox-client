import * as React from 'react';
import { Spring } from 'react-spring';
import Portal from 'common/components/Portal';

import { Container, Item, ItemContainer } from './elements';

class ContextMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      show: false,
      down: true,
      right: true,
    };

    this.mousedownHandler = mousedownEvent => {
      const { show } = this.state;

      if (show && this.el) {
        if (!this.el.contains(mousedownEvent.target)) {
          this.close();
        }
      }
    };

    this.keydownHandler = keydownEvent => {
      const { show } = this.state;
      if (keydownEvent.keyCode === 27 && show) {
        // Escape
        this.close();
      }
    };
  }

  onContextMenu = event => {
    if (!this.unmounted) {
      const body = document.body;
      const html = document.documentElement;

      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      const width = Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      );

      event.preventDefault();
      this.mousedown = window.addEventListener(
        'mousedown',
        this.mousedownHandler
      );
      this.keydown = window.addEventListener('keydown', this.keydownHandler);

      const isDown = height - event.clientY > 150;
      const isLeft = width - event.clientX > 200;
      this.setState({
        show: true,
        x: event.clientX + 10,
        y: event.clientY + (isDown ? 10 : -10),
        down: isDown,
        left: isLeft,
      });

      if (this.props.onContextMenu) {
        this.props.onContextMenu(event);
      }
    }
  };

  componentWillUnmount() {
    this.unregisterListeners();
    this.unmounted = true;
  }

  unregisterListeners = () => {
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('mousedown', this.mousedownHandler);
  };

  close = () => {
    if (!this.unmounted) {
      this.unregisterListeners();
      this.setState({
        show: false,
      });
    }
  };

  render() {
    if (this.unmounted) {
      return null;
    }

    // remove isDraggingItem from the list of props as it's generating warnings.
    const {
      children,
      childFunction,
      items,
      isDraggingItem,
      ...props
    } = this.props;
    const { show, x, y, down, left } = this.state;

    const mapFunction = (item, i) => {
      if (Array.isArray(item)) {
        if (item.length === 0) {
          return null;
        }
        return <ItemContainer key={i}>{item.map(mapFunction)}</ItemContainer>;
      }

      return (
        <Item
          key={item.title}
          color={item.color}
          onMouseDown={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseUp={e => {
            if (item.action()) {
              e.preventDefault();
              this.close();
            }
          }}
        >
          {item.icon && <item.icon />}
          {item.title}
        </Item>
      );
    };

    return (
      <div
        {...props}
        onContextMenu={childFunction ? undefined : this.onContextMenu}
      >
        {childFunction ? children(this.onContextMenu) : children}
        {show && (
          <Portal>
            <div
              ref={el => {
                this.el = el;
              }}
            >
              <Spring
                from={{ opacity: 0.6, height: 0, width: 'auto' }}
                to={{ opacity: 1, height: 'auto', width: 'auto' }}
              >
                {({ ...styles }) => (
                  <Container {...styles}>{items.map(mapFunction)}</Container>
                )}
              </Spring>
            </div>
          </Portal>
        )}
      </div>
    );
  }
}

export default ContextMenu;
