import React from 'react';
import Loadable from 'react-loadable';
import Loading from 'app/components/Loading';
import { Preferences } from 'common/types';

import Monaco from './Monaco';

type Props = {
  preferences: Preferences,
};

const CodeMirror = Loadable({
  loader: () => import(/* webpackChunkName: 'codemirror' */ './CodeMirror'),
  LoadingComponent: Loading,
});

export default (props: Props) => {
  // We are phasing towards Monaco, the only thing missing is vim mode. So use
  // CodeMirror until we have proper support
  if (props.preferences.vimMode || props.preferences.codeMirror) {
    return <CodeMirror {...props} />;
  }

  return <Monaco {...props} />;
};
