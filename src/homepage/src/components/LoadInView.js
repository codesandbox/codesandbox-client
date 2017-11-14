import React from 'react';
import { debounce } from 'lodash';

import getScrollPos from '../utils/scroll';

export default class LoadInView extends React.PureComponent {
  state = {
    show: false,
  };

  constructor(props) {
    super(props);
    this.listen = debounce(this.listen, 50);
  }

  listen = () => {
    if (!this.state.show && getScrollPos().y < this.elPos) {
      this.setState({ show: true });
    }
  };

  componentDidMount() {
    this.elPos = this.el.getBoundingClientRect().top;

    window.addEventListener('scroll', this.listen);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listen);
  }

  render() {
    const { children } = this.props;
    return (
      <div
        style={{ display: 'inline-block', width: 'inherit' }}
        ref={el => {
          this.el = el;
        }}
      >
        {this.state.show && children}
      </div>
    );
  }
}
