// @flow
import React from 'react';

import type { Editor, Settings } from '../types';
import MonacoReactComponent from '../Monaco/MonacoReactComponent';
import defineTheme from '../Monaco/define-theme';

import { Container, CodeContainer } from '../Monaco/elements';
import getSettings from '../Monaco/settings';

type Props = {
  originalCode: string,
  modifiedCode: string,
  settings: Settings,
};

export default class MonacoDiff extends React.Component<Props>
  implements Editor {
  editor: any;
  sizeProbeInterval: IntervalID; // eslint-disable-line no-undef

  settings: Settings;

  constructor(props: Props) {
    super(props);

    this.settings = props.settings;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeEditor);
    clearInterval(this.sizeProbeInterval);
  }

  resizeEditor = () => {
    this.forceUpdate(() => {
      this.editor.layout();
    });
  };

  configureEditor = async (editor: any, monaco: any) => {
    this.editor = editor;
    const originalModel = monaco.editor.createModel(
      this.props.originalCode,
      'application/javascript'
    );
    const modifiedModel = monaco.editor.createModel(
      this.props.modifiedCode,
      'application/javascript'
    );

    window.addEventListener('resize', this.resizeEditor);

    editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    this.resizeEditor();
    this.sizeProbeInterval = setInterval(this.resizeEditor.bind(this), 3000);
  };

  render() {
    return (
      <Container>
        <CodeContainer>
          <MonacoReactComponent
            diffEditor
            theme="CodeSandbox"
            editorWillMount={defineTheme}
            editorDidMount={this.configureEditor}
            options={getSettings(this.settings)}
          />
        </CodeContainer>
      </Container>
    );
  }
}
