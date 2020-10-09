import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import { Element, Button, Stack, Text } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';
import CodeMirror from 'codemirror';
import { getCodeMirror } from 'app/utils/codemirror';
import { Alert } from '../Common/Alert';
import { CodeMirrorWrapper } from './CodeMirrorWrapper';

const validateValue = (value: string) => {
  try {
    const parsedValue = JSON.parse(value);

    if (
      typeof parsedValue === 'object' &&
      !Array.isArray(parsedValue) &&
      parsedValue !== null
    ) {
      return Object.keys(parsedValue).reduce((aggr, key) => {
        if (aggr) return aggr;

        if (
          !Array.isArray(parsedValue[key]) ||
          typeof parsedValue[key][0] !== 'number' ||
          typeof parsedValue[key][1] !== 'number'
        ) {
          return 'Error: Invalid preset definition';
        }

        return aggr;
      }, undefined);
    }

    return 'Error: Invalid preset definition';
  } catch {
    return 'Error: Invalid JSON';
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

  const validationError = validateValue(value);

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
        <CodeMirrorWrapper
          error={Boolean(validationError)}
          ref={codemirrorContainer}
        />
        <Text
          variant="danger"
          paddingTop={4}
          size={3}
          block
          style={{ minHeight: 32 }}
        >
          {validationError}
        </Text>
        <Stack justify="flex-end" marginTop={4} gap={2}>
          <Button onClick={modalClosed} variant="link" autoWidth type="button">
            Cancel
          </Button>
          <Button
            autoWidth
            type="submit"
            onClick={savePresets}
            disabled={Boolean(validationError)}
          >
            Save Presets
          </Button>
        </Stack>
      </Element>
    </Alert>
  );
};
