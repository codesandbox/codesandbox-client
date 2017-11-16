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
    if (!this.state.show && this.elPos && getScrollPos().y + 600 > this.elPos) {
      requestAnimationFrame(() => {
        this.setState({ show: true });
      });
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
    const { children, style, ...props } = this.props;
    return (
      <div
        style={{ display: 'inline-block', width: '100%', ...style }}
        ref={el => {
          this.el = el;
        }}
        {...props}
      >
        {this.state.show && children}
      </div>
    );
  }
}
