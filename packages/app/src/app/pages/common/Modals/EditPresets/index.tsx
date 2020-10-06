import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import { Element, Button, Stack } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';
import CodeMirror from 'codemirror';
import { getCodeMirror } from 'app/utils/codemirror';
import { Alert } from '../Common/Alert';
import { CodemirrorWrapper } from './codeMirrorTheme';

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
      console.error('Error parsing JSON');
    }
  };

  const listenForEsc = (e: KeyboardEvent) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codemirrorContainer]);

  useEffect(() => {
    window.addEventListener('keydown', listenForEsc);

    return () => window.removeEventListener('keydown', listenForEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Alert title="Edit Presets">
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
