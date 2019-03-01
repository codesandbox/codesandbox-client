'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
exports.BorderRadius = styled_components_1.default.div`
  transition: 0.3s ease all;
  border-radius: 4px;
  border: 1px solid #4f5459;
  font-size: 0.75em;
  margin-right: 1rem;

  display: flex;

  ${props =>
    props.hasUrl &&
    styled_components_1.css`
      &:hover {
        background-color: #4f5459;
      }
    `};
`;
exports.Text = styled_components_1.default.span`
  display: inline-block;

  color: ${props =>
    props.theme.light ? '#636363' : 'rgba(255, 255, 255, 0.6)'};
  border-radius: 4px;
  padding: 3px 5px;

  &:hover {
    color: rgba(255, 255, 255, 0.6);
  }
`;
exports.Icon = styled_components_1.default.span`
  display: inline-block;
  padding: 3px 5px;
  background-color: #4f5459;
  border-radius: 2px;
  color: ${props => props.theme.background};
`;
exports.StyledA = styled_components_1.default.a`
  text-decoration: none;
`;
