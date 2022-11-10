import * as React from 'react';
import { getSandpackCssText } from '@codesandbox/sandpack-react';

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
