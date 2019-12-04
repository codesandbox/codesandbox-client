import * as React from 'react';
import { IInstance, Controlled } from 'react-codemirror2';
import codemirror from 'codemirror';

import withSandpack from '../../../utils/with-sandpack';
import cn from '../../../utils/cn';
import { ISandpackContext } from '../../../types';

import CodeMirrorComponent from '../../../helper-components/CodeMirror';

interface Props {
  sandpack: ISandpackContext;
  codeMirrorOptions: codemirror.EditorConfiguration;
  style?: Object;
  className?: string;
}

class CodeMirror extends React.PureComponent<Props> {
  static defaultProps = {
    codeMirrorOptions: {},
  };

  onChange = (
    editor: IInstance,
    data: codemirror.EditorChange,
    value: string
  ) => {
    this.props.sandpack.updateFiles({
      ...this.props.sandpack.files,
      [this.props.sandpack.openedPath]: {
        code: value,
      },
    });
  };

  render() {
    const { codeMirrorOptions, ...props } = this.props;
    const { openedPath, files } = this.props.sandpack;

    return (
      <CodeMirrorComponent
        codeMirrorOptions={codeMirrorOptions}
        onBeforeChange={this.onChange}
        value={files[openedPath].code}
        {...props}
      />
    );
  }
}

export default withSandpack(CodeMirror);
