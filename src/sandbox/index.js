import React from 'react';
import { render } from 'react-dom';
import createProxy from 'react-proxy';
import deepForceUpdate from 'react-deep-force-update';
import 'normalize.css';

import ErrorComponent from './Error';

import evalModule from './eval-module';

const element = document.getElementById('root');
const errorElement = document.getElementById('error');
let proxy = null;
let rootInstance = null;

const executeCode = (code, modules) => {
  if (!element) return;
  let error = null;
  try {
    const Element = evalModule(code, modules).default;
    if (proxy) {
      proxy.update(Element);
      deepForceUpdate(rootInstance);
    } else {
      proxy = createProxy(Element);
      const Proxy = proxy.get();
      rootInstance = render(<Proxy />, element);
    }
  } catch (e) {
    error = e;
  }
  render(<ErrorComponent error={error} />, errorElement);
};

window.parent.postMessage('Ready!', '*');
window.addEventListener('message', (e) => {
  const { modules, code } = e.data;
  executeCode(code, modules);
});
