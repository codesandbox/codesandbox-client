const React = require('react');
const { ServerStyleSheet, StyleSheetManager } = require('styled-components');

const sheetByPathname = new Map();

// eslint-disable-next-line react/prop-types,react/display-name
exports.wrapRootElement = ({ element, pathname }) => {
  const sheet = new ServerStyleSheet();
  sheetByPathname.set(pathname, sheet);
  return (
    <StyleSheetManager sheet={sheet.instance}>{element}</StyleSheetManager>
  );
};

exports.onRenderBody = ({ setHeadComponents, pathname }) => {
  const sheet = sheetByPathname.get(pathname);
  if (sheet) {
    setHeadComponents([sheet.getStyleElement()]);
    sheetByPathname.delete(pathname);
  }
};
