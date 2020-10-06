import styled from 'styled-components';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import { Element, Button, Stack } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';
import CodeMirror from 'codemirror';
import { getCodeMirror } from 'app/utils/codemirror';
import { Alert } from '../Common/Alert';

const CodemirrorWrapper = styled.div`
  .CodeMirror {
    background-color: #263238;
    color: rgba(233, 237, 237, 1);
  }
  .CodeMirror-gutters {
    background: #263238;
    color: rgb(83, 127, 126);
    border: none;
  }
  .CodeMirror-guttermarker,
  .CodeMirror-guttermarker-subtle,
  .CodeMirror-linenumber {
    color: rgb(83, 127, 126);
  }
  .CodeMirror-cursor {
    border-left: 1px solid #f8f8f0;
  }
  div.CodeMirror-selected {
    background: rgba(255, 255, 255, 0.15);
  }
  .CodeMirror-focused div.CodeMirror-selected {
    background: rgba(255, 255, 255, 0.1);
  }
  .CodeMirror-line::selection,
  .CodeMirror-line > span::selection,
  .CodeMirror-line > span > span::selection {
    background: rgba(255, 255, 255, 0.1);
  }
  .CodeMirror-line::-moz-selection,
  .CodeMirror-line > span::-moz-selection,
  .CodeMirror-line > span > span::-moz-selection {
    background: rgba(255, 255, 255, 0.1);
  }

  .CodeMirror-activeline-background {
    background: rgba(0, 0, 0, 0);
  }
  .cm-keyword {
    color: rgba(199, 146, 234, 1);
  }
  .cm-operator {
    color: rgba(233, 237, 237, 1);
  }
  .cm-variable-2 {
    color: #80cbc4;
  }
  .cm-variable-3,
  .cm-type {
    color: #82b1ff;
  }
  .cm-builtin {
    color: #decb6b;
  }
  .cm-atom {
    color: #f77669;
  }
  .cm-number {
    color: #f77669;
  }
  .cm-def {
    color: rgba(233, 237, 237, 1);
  }
  .cm-string {
    color: #c3e88d;
  }
  .cm-string-2 {
    color: #80cbc4;
  }
  .cm-comment {
    color: #546e7a;
  }
  .cm-variable {
    color: #82b1ff;
  }
  .cm-tag {
    color: #80cbc4;
  }
  .cm-meta {
    color: #80cbc4;
  }
  .cm-attribute {
    color: #ffcb6b;
  }
  .cm-property {
    color: #80cbae;
  }
  .cm-qualifier {
    color: #decb6b;
  }
  .cm-variable-3,
  .cm-type {
    color: #decb6b;
  }
  .cm-tag {
    color: rgba(255, 83, 112, 1);
  }
  .cm-error {
    color: rgba(255, 255, 255, 1);
    background-color: #ec5f67;
  }
  .CodeMirror-matchingbracket {
    text-decoration: underline;
    color: white !important;
  }
`;

const isValidValue = (value: string) => {
  try {
    const parsedValue = JSON.parse(value);

    if (Array.isArray(parsedValue)) {
      throw new Error('Invalid');
    }

    Object.keys(parsedValue).forEach(key => {
      if (
        !Array.isArray(parsedValue[key]) ||
        typeof parsedValue[key][0] !== 'number' ||
        typeof parsedValue[key][1] !== 'number'
      ) {
        throw new Error('Invalid');
      }
    });

    return true;
  } catch {
    return false;
  }
};

export const EditPresets: FunctionComponent = () => {
  const {
    actions: { preview: previewActions, modalClosed },
    state: {
      preview: { responsive },
    },
  } = useOvermind();
  const [value, setValue] = React.useState(
    JSON.stringify(responsive.presets, null, 2)
  );
  const codemirrorContainer = React.useRef(null);

  const isValid = isValidValue(value);

  const savePresets = () => {
    try {
      const data = JSON.parse(value);
      previewActions.toggleEditPresets();
      previewActions.editPresets(data);
      modalClosed();
    } catch (e) {
      // aaaaa
    }
  };
  const listenForEsc = e => {
    if (e.keyCode === ESC) {
      modalClosed();
    }
  };

  useEffect(() => {
    if (codemirrorContainer.current) {
      const codemirror = getCodeMirror(
        codemirrorContainer.current,
        new CodeMirror.Doc(value, 'javascript'),
        {
          lineNumbers: false,
          foldGutter: false,
          styleActiveLine: false,
        }
      );
      // This fixes a positioning bug with Codemirror. If not here,
      // the cursor will not point correctly to the line and characters
      setTimeout(() => {
        codemirror.getDoc().setValue(value);
      }, 500);

      codemirror.on('change', () => {
        setValue(codemirror.getDoc().getValue());
      });
    }
  }, [codemirrorContainer]);

  useEffect(() => {
    window.addEventListener('keydown', listenForEsc);

    return () => window.removeEventListener('keydown', listenForEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Alert title="Add custom preset">
      <Element marginTop={4}>
        <CodemirrorWrapper ref={codemirrorContainer} />
        <Stack justify="flex-end" marginTop={11} gap={2}>
          <Button onClick={modalClosed} variant="link" autoWidth type="button">
            Cancel
          </Button>
          <Button
            autoWidth
            type="submit"
            onClick={savePresets}
            disabled={!isValid}
          >
            Save Presets
          </Button>
        </Stack>
      </Element>
    </Alert>
  );
};
