import React from 'react';
import Loadable from 'react-loadable';
import { inject, observer } from 'mobx-react';
import Loading from 'app/components/Loading';
import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
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

export default inject('store', 'signals')(
  observer(({ store, signals }) => {
    const settings = store.editor.preferences.settings;
    const module = store.editor.currentModule;

    if (module) {
      if (module.isBinary) {
        if (isImage(module.title)) {
          return (
            <ImageViewer
              changeCode={code => signals.editor.codeChanged({ code })}
              saveCode={() => signals.editor.codeSaved()}
              code={module.code}
              title={module.title}
              id={module.id}
              isNotSynced={
                store.editor.changedModuleShortids.indexOf(module.shortid) >= 0
              }
            />
          );
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
      return <CodeMirror />;
    }

    return <Monaco />;
  })
);
