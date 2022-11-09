import * as React from 'react';
import { getSandpackCssText } from '@codesandbox/sandpack-react';

// https://mathiasbynens.be/notes/globalthis
// The polyfill starts here.
/* eslint-disable no-undef,no-extend-native */
(function () {
  if (typeof globalThis === 'object') return;
  Object.defineProperty(Object.prototype, '__magic__', {
    get() {
      return this;
    },
    configurable: true,
  });
  __magic__.globalThis = __magic__;
  delete Object.prototype.__magic__;
})();
// The polyfill ends here.
// #endregion The polyfill ends here.

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <style
      id="sandpack"
      dangerouslySetInnerHTML={{
        __html: getSandpackCssText(),
      }}
    />,
  ]);
};
