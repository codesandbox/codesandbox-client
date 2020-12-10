import * as React from 'react';
import { IInstance, Controlled } from 'react-codemirror2';
import codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/sublime';

export interface Props {
  onBeforeChange: (
    editor: IInstance,
    data: codemirror.EditorChange,
    value: string
  ) => void;
  value: string;
  codeMirrorOptions?: Partial<codemirror.EditorConfiguration>;
  className?: string;
  style?: Object;
}

const CodeMirror: React.FC<Props> = props => {
  const {
    codeMirrorOptions = {},
    onBeforeChange,
    value,
    style = {},
    className = '',
  } = props;

  const c = (
    // @ts-ignore
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
      onBeforeChange={onBeforeChange}
      value={value}
    />
  );
  return (
    <div
      className={`sandpack-Codemirror__container ${className}`}
      style={style}
    >
      {c}
    </div>
  );
};

export default CodeMirror;
