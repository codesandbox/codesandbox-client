'use strict';
var __rest =
  (this && this.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const Input_1 = require('../Input');
class PreferenceText extends React.PureComponent {
  constructor() {
    super(...arguments);
    this.handleChange = e => {
      const value = e.target.value;
      this.props.setValue(value);
    };
  }
  render() {
    const _a = this.props,
      { value, placeholder, isTextArea } = _a,
      props = __rest(_a, ['value', 'placeholder', 'isTextArea']);
    return React.createElement(
      isTextArea ? Input_1.TextArea : Input_1.default,
      Object.assign(
        {
          style: { width: '9rem' },
          value,
          placeholder,
          onChange: this.handleChange,
        },
        props
      )
    );
  }
}
exports.default = PreferenceText;
