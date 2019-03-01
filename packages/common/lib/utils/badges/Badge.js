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
const styled_components_1 = require('styled-components');
const Tooltip_1 = require('../../components/Tooltip');
const _1 = require('.');
const NameContainer = styled_components_1.default.div`
  display: inline-block;
  text-align: center;
`;
const Image = styled_components_1.default.img`
  transition: 0.3s ease all;
  margin-bottom: -0.4em;

  opacity: ${props => (props.visible ? 1 : 0.5)};
  cursor: pointer;

  &:hover {
    ${props => !props.visible && `opacity: .75;`};
  }
`;
class Badge extends React.Component {
  constructor() {
    super(...arguments);
    this.handleClick = () => {
      if (this.props.onClick) {
        this.props.onClick(this.props.badge);
      }
    };
  }
  render() {
    const _a = this.props,
      { visible, badge, tooltip, size, onClick } = _a,
      props = __rest(_a, ['visible', 'badge', 'tooltip', 'size', 'onClick']);
    const innerContent = React.createElement(
      Image,
      Object.assign({}, props, {
        width: size,
        src: _1.default(badge.id),
        alt: badge.name,
        visible: visible || badge.visible,
        onClick: this.handleClick,
      })
    );
    if (tooltip !== false) {
      return React.createElement(
        Tooltip_1.default,
        { style: { display: 'block' }, title: tooltip || badge.name },
        innerContent
      );
    }
    return React.createElement(
      NameContainer,
      null,
      innerContent,
      React.createElement('div', { style: { marginTop: '0.5rem' } }, badge.name)
    );
  }
}
exports.default = Badge;
