import * as React from 'react';
import { CodeMirror } from './CodeMirror';
import { useSandpack } from '../../contexts/sandpack-context';
import { FileTabs } from '../FileTabs';
import { RunIcon } from '../../icons';

export type CodeEditorOptions = {
  showTabs?: boolean;
  showLineNumbers?: boolean;
  wrapContent?: boolean;
};
export type CodeEditorProps = CodeEditorOptions & {
  customStyle?: React.CSSProperties;
};

export const CodeEditor = ({
  customStyle,
  showTabs = false,
  showLineNumbers = false,
  wrapContent = false,
}: CodeEditorProps) => {
  const { sandpack } = useSandpack();
  // const [mouseOver, setMouseOver] = React.useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const {
    activePath,
    status,
    editorState,
    runSandpack,
    // changeActiveFile,
  } = sandpack;
  const code = sandpack.files[activePath].code;

  const handleCodeUpdate = (newCode: string) => {
    sandpack.updateCurrentFile(newCode);
  };

  // const handleCloseOverlay = () => {
  //   setMouseOver(false);
  //   if (editorRef.current) {
  //     const contentNode = editorRef.current.querySelector(
  //       '.cm-content'
  //     ) as HTMLElement;
  //     contentNode.focus();
  //     changeActiveFile(activePath); // force editor status to switch to dirty
  //   }
  // };

  return (
    <div style={customStyle}>
      {showTabs && <FileTabs />}
      <div
        className="sp-editor"
        // onMouseEnter={() => setMouseOver(true)}
        // onMouseLeave={() => setMouseOver(false)}
        ref={editorRef}
      >
        {/* {mouseOver && editorState === 'pristine' && (
          <div
            aria-hidden
            className="sp-editor-overlay"
            onClick={handleCloseOverlay}
          >
            <span>Click to Edit</span>
          </div>
        )} */}

        <CodeMirror
          activePath={activePath}
          code={code}
          key={activePath}
          editorState={editorState}
          onCodeUpdate={handleCodeUpdate}
          showLineNumbers={showLineNumbers}
          wrapContent={wrapContent}
        />
      </div>

      {status === 'idle' && (
        <button
          type="button"
          className="sp-button"
          style={{
            position: 'absolute',
            bottom: 'var(--sp-space-2)',
            right: 'var(--sp-space-2)',
          }}
          onClick={() => runSandpack()}
        >
          <RunIcon />
          Run
        </button>
      )}
    </div>
  );
};
