import * as React from 'react';
import { Controlled } from 'react-codemirror2';
import codemirror from 'codemirror';

import withSandpack from '../../../utils/with-sandpack';
import cn from '../../../utils/cn';
import { ISandpackContext } from '../../../types';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/sublime';

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

  onChange = (editor: any, data: any, value: string) => {
    this.props.sandpack.updateFiles({
      ...this.props.sandpack.files,
      [this.props.sandpack.openedPath]: {
        code: value,
      },
    });
  };

  render() {
    const { codeMirrorOptions, style = {}, className = '' } = this.props;
    const { openedPath, files } = this.props.sandpack;

    return (
      <div
        className={`${cn('CodeMirror', 'container')} ${className}`}
        style={{ ...style, position: 'relative' }}
      >
        <Controlled
          options={{
            keyMap: 'sublime',
            indentUnit: 2,
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            lineNumbers: true,
            lineWrapping: false,
            mode: 'jsx',
            ...codeMirrorOptions,
          }}
          onBeforeChange={this.onChange}
          value={files[openedPath].code}
        />
      </div>
    );
  }
}

export default withSandpack(CodeMirror);
