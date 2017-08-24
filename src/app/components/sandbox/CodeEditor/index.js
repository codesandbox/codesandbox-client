import React from 'react';
import Loadable from 'react-loadable';

import Monaco from './Monaco';

const CodeMirror = Loadable({
  loader: () => import('./CodeMirror'),
  LoadingComponent: 'div',
});

export default props => {
  // We are phasing towards Monaco, the only thing missing is vim mode. So use
  // CodeMirror until we have proper support
  if (props.preferences.vimMode || props.preferences.codeMirror) {
    return <CodeMirror {...props} />;
  }

  return <Monaco {...props} />;
};
