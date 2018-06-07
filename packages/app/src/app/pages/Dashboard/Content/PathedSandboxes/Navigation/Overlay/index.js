import React from 'react';
import { observer } from 'mobx-react';

import { Transition } from 'react-spring';

const Empty = () => <span />;

class OverlayComponent extends React.Component {
  state = {
    isOpen: false,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.listenForClick);
  }

  listenForClick = (e: MouseEvent) => {
    if (!e.defaultPrevented && this.state.isOpen) {
      this.setState({ isOpen: false });
    }
  };

  open = () => {
    this.setState({ isOpen: true });
  };

  render() {
    const { children, Overlay } = this.props;
    const { isOpen } = this.state;

    return (
      <div
        style={{ position: 'relative' }}
        onMouseDown={e => e.preventDefault()}
      >
        {children(this.open)}
        <Transition
          from={{ height: 0, opacity: 0 }}
          enter={{ height: 'auto', opacity: 1 }}
          leave={{ height: 0, opacity: 0 }}
        >
          {/* TODO: Fix this */}
          {isOpen ? Overlay : Empty}
        </Transition>
      </div>
    );
  }
}

export default observer(OverlayComponent);
