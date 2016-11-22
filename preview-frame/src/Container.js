import React from 'react';
import { render } from 'react-dom';
import createProxy from 'react-proxy';
import deepForceUpdate from 'react-deep-force-update';

import evalModule from './eval-module';

export default class Container extends React.Component {
  componentDidMount() {
    window.parent.postMessage('Ready!', '*');
    window.addEventListener('message', (e) => {
      const { modules, code } = e.data;
      this.executeCode(code, modules);
    });
  }

  executeCode = (code, modules) => {
    if (!this.element) return;

    try {
      const Element = evalModule(code, modules).default;
      if (this.proxy) {
        this.proxy.update(Element);
        deepForceUpdate(this.rootInstance);
      } else {
        this.proxy = createProxy(Element);
        const Proxy = this.proxy.get();
        this.rootInstance = render(<Proxy />, this.element);
      }
    } catch (e) {
      console.error(e);
    }
  }

  element: ?Element;
  proxy: ?Object;
  rootInstance: ?Object;

  render() {
    return (
      <div>
        <div ref={(el) => { this.element = el; }} />
      </div>
    );
  }
}
