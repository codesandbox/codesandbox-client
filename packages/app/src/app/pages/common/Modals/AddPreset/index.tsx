import css from '@styled-system/css';
import { CurrentUser } from '@codesandbox/common/lib/types';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import { Element, Input, Stack, Button } from '@codesandbox/components';
import React, {
  FormEvent,
  FunctionComponent,
  useState,
  useEffect,
} from 'react';
import { Alert } from '../Common/Alert';

type Props = {
  id?: string;
  user?: CurrentUser;
};

export const AddPreset: FunctionComponent<Props> = ({ id, user }) => {
  const {
    actions: { preview, modalClosed },
    state: {
      preview: { responsive },
    },
  } = useOvermind();
  const [name, setName] = useState('');
  const [width, setWidth] = useState(responsive.resolution[0]);
  const [height, setHeight] = useState(responsive.resolution[1]);

  const listenForEsc = e => {
    if (e.keyCode === ESC) {
      modalClosed();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', listenForEsc);

    return () => window.removeEventListener('keydown', listenForEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    preview.addPreset({
      name,
      height,
      width,
    });
    modalClosed();
  };

  const reverseValues = () => {
    const tempWidth = width;
    const tempHeight = height;

    setWidth(tempHeight);
    setHeight(tempWidth);
  };

  return (
    <Alert title="Add custom preset">
      <Element marginTop={4}>
        <form onSubmit={onSubmit} autoComplete="off">
          <Element marginBottom={4}>
            <Input
              autoFocus
              aria-label="Presets Name"
              name="name"
              onChange={e => setName(e.target.value)}
              placeholder="Presets Name"
              required
              value={name}
            />
          </Element>
          <Stack gap={3}>
            <Input
              aria-label="Preset Width"
              type="number"
              name="width"
              onChange={e => setWidth(parseInt(e.target.value, 10))}
              required
              value={width}
            />
            <Button
              variant="link"
              autoWidth
              type="button"
              onClick={reverseValues}
            >
              <svg
                width={12}
                height={10}
                fill="none"
                viewBox="0 0 12 10"
                css={css({
                  path: {
                    fill: 'sideBar.foreground',
                  },
                })}
              >
                <path d="M12 2.222v1.111c-.923 0-2.094 1.25-2.77 2.223h-.922c.21-.667.923-2.223.923-2.223H0V2.2h9.23L8.309 0h.923S11.077 2.222 12 2.222zM0 7.778V6.667c.923 0 2.094-1.25 2.77-2.223h.922c-.21.667-.923 2.223-.923 2.223H12V7.8H2.77l.922 2.2H2.77S.923 7.778 0 7.778z" />
              </svg>
            </Button>
            <Input
              aria-label="Preset Height"
              type="number"
              name="height"
              onChange={e => setHeight(parseInt(e.target.value, 10))}
              required
              value={height}
            />
          </Stack>
          <Stack justify="flex-end" marginTop={11} gap={2}>
            <Button
              onClick={modalClosed}
              variant="link"
              autoWidth
              type="button"
            >
              Cancel
            </Button>
            <Button
              autoWidth
              type="submit"
              disabled={!name || !width || !height}
            >
              Add Preset
            </Button>
          </Stack>
        </form>
      </Element>
    </Alert>
  );
};
