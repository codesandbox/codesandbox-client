import * as React from 'react';
import { CodeMirror } from './CodeMirror';
import { useSandpack } from '../../hooks/useSandpack';
import { FileTabs } from '../FileTabs';
import { RunIcon } from '../../icons';
import { useActiveCode } from '../../hooks/useActiveCode';

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
  showTabs,
  showLineNumbers = false,
  wrapContent = false,
}: CodeEditorProps) => {
  const { sandpack } = useSandpack();
  const { code, updateCode } = useActiveCode();
  // const [mouseOver, setMouseOver] = React.useState(false);
  const editorRef = React.useRef<HTMLDivElement>(null);
  const {
    activePath,
    status,
    editorState,
    runSandpack,
    // changeActiveFile,
  } = sandpack;
  const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

  const handleCodeUpdate = (newCode: string) => {
    updateCode(newCode);
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
    <div className="sp-stack" style={customStyle}>
      {shouldShowTabs && <FileTabs />}
      <div
        className="sp-editor-frame"
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
