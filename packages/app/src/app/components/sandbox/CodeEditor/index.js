import React from 'react';
import Loadable from 'react-loadable';

import Loading from 'app/components/Loading';
import Title from 'app/components/text/Title';
import SubTitle from 'app/components/text/SubTitle';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import { Preferences, Module, Directory } from 'common/types';
import isImage from 'common/utils/is-image';

import Monaco from './Monaco';
import ImageViewer from './ImageViewer';

type Props = {
  preferences: Preferences,
  id: string,
  modules: Array<Module>,
  directories: Array<Directory>,
  changeCode: (id: string, code: string) => Object,
  saveCode: ?() => void,
};

const CodeMirror = Loadable({
  loader: () =>
    import(/* webpackChunkName: 'codemirror-editor' */ './CodeMirror'),
  LoadingComponent: Loading,
});

export default (props: Props) => {
  const module = props.modules.find(m => m.id === props.id);

  if (module) {
    if (module.isBinary) {
      if (isImage(module.title)) {
        return (
          <ImageViewer
            changeCode={props.changeCode}
            saveCode={props.saveCode}
            code={module.code}
            title={module.title}
            id={module.id}
            isNotSynced={module.isNotSynced}
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
  if (props.preferences.vimMode || props.preferences.codeMirror) {
    return <CodeMirror {...props} />;
  }

  return <Monaco {...props} />;
};
