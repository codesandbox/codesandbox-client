import React from 'react';
import { render } from 'react-dom';
import createProxy from 'react-proxy';
import deepForceUpdate from 'react-deep-force-update';

export default class ReactMode {
  constructor(element) {
    this.element = element;
    this.proxy = null;
    this.rootInstance = null;
  }

  static type = 'react';

  render(Element, force = false) {
    if (force) {
      this.proxy = null;
      this.rootInstance = null;
      render(<Element />, this.element);
      return;
    }

    if (this.proxy) {
      this.proxy.update(Element);
      deepForceUpdate(this.rootInstance);
    } else {
      this.proxy = createProxy(Element);
      const Proxy = this.proxy.get();
      this.rootInstance = render(<Proxy />, this.element);
    }
  }
}
