'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const React = require('react');
const styled_components_1 = require('styled-components');
const Container = styled_components_1.default.div`
  box-sizing: border-box;
  display: flex;

  padding: 0 2rem;

  width: 100%;
  justify-content: center;

  ${props =>
    props.responsive &&
    styled_components_1.css`
      @media (max-width: 768px) {
        padding: 0;
      }
    `};
`;
const InnerContainer = styled_components_1.default.div`
  width: 100%;
  max-width: ${props => props.width}px;
`;
exports.default = ({ children, width = 1280, className, responsive = false }) =>
  React.createElement(
    Container,
    { responsive: responsive },
    React.createElement(
      InnerContainer,
      { className: className, width: width },
      children
    )
  );
