'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const styled_components_1 = require('styled-components');
exports.Stats = styled_components_1.default.div`
  display: flex;

  ${props =>
    props.vertical
      ? styled_components_1.css`
          flex-direction: column;
        `
      : styled_components_1.css`
          flex-direction: row;
          align-items: center;
        `};

  height: 100%;
`;
