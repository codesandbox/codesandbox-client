'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
exports.CenteredText = styled_components_1.default.div`
  ${props =>
    !props.disableCenter &&
    styled_components_1.css`
      justify-content: center;
    `};
  align-items: center;
  display: inline-flex;
  flex-direction: row;
  margin-bottom: 0.5rem;

  width: ${props => (props.text ? '10em' : '5em')};

  svg {
    opacity: 0.75;
    font-size: 1.125em;
  }
`;
