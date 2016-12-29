export default class ReactMode {
  constructor(element, React, ReactDOM) {
    this.element = element;
    this.proxy = null;
    this.rootInstance = null;
    this.React = React;
    this.ReactDOM = ReactDOM;
  }

  static type = 'react';

  render(Element) {
    this.ReactDOM.render(this.React.createElement(Element), this.element);
  }
}
