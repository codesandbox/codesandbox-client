import React from 'react';
import Loadable from 'react-loadable';
import Loading from 'app/components/Loading';
import Title from 'app/components/Title';
import SubTitle from 'app/components/SubTitle';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import isImage from 'common/utils/is-image';

import Monaco from './Monaco';
import ImageViewer from './ImageViewer';

const CodeMirror = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'codemirror-editor' */ './CodeMirror'),
  LoadingComponent: Loading,
});

function CodeEditor(props) {
  const settings = props.settings;
  const module = props.currentModule;

  if (module) {
    if (module.isBinary) {
      if (isImage(module.title)) {
        return <ImageViewer {...props} />;
      }

      return (
        <Margin style={{ overflow: 'auto' }} top={2}>
          <Centered horizontal vertical>
            <Title>This file is too big to edit</Title>
            <SubTitle>
              We will add support for this as soon as possible.
            </SubTitle>

            <a href={module.code} target="_blank" rel="noreferrer noopener">
              Open file externally
            </a>
          </Centered>
        </Margin>
      );
    }
  }

  // We are phasing towards Monaco, the only thing missing is vim mode. So use
  // CodeMirror until we have proper support
  if (settings.vimMode || settings.codeMirror) {
    return <CodeMirror {...props} />;
  }

  return <Monaco {...props} />;
}

export default CodeEditor;
