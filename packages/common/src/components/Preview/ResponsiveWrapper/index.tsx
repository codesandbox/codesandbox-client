import { Stack, Text, Button, Input } from '@codesandbox/components';
import { json } from 'overmind';
import React, { useCallback, useEffect, useState } from 'react';
import { isEqual, debounce } from 'lodash-es';

import { AddIcon, DeleteIcon, SwitchIcon } from './Icons';
import { ResponsiveWrapperProps } from './types';
import { PresetMenu } from './PresetMenu';
import { useDragResize } from './useDragResize';
import { Wrapper } from './elements';
import { ResizeHandles } from './ResizeHandles';

export const ResponsiveWrapper = ({
  on,
  canChangePresets,
  props: { theme, state, actions },
  children,
}: ResponsiveWrapperProps) => {
  const {
    responsive: { scale: defaultScale, resolution, presets },
  } = state;
  const [inputWidth, setInputWidth] = useState(resolution[0]);
  const [inputHeight, setInputHeight] = useState(resolution[0]);
  const [width, setWidth] = useState<string>('100%');
  const [height, setHeight] = useState<string>('100%');
  const [scale, setScale] = useState<number>(defaultScale / 100);
  const element = document.getElementById('sandbox-preview-container');
  const [wrapperWidth, setWrapperWidth] = useState(element?.clientWidth - 20);
  const [wrapperHeight, setWrapperHeight] = useState(
    element?.clientHeight - 100
  );
  const widthAndHeightResizer = useState<{ x: number; y: number } | null>(null);
  const widthResizer = useState<{ x: number } | null>(null);
  const heightResizer = useState<{ y: number } | null>(null);

  useEffect(() => {
    let observer;
    if (element) {
      // TS does not know of ResizeObserver
      // @ts-ignore
      observer = new ResizeObserver(entries => {
        entries.map(entry => {
          if (entry.contentRect) {
            const sizes = entry.contentRect;

            setWrapperWidth(sizes.width - 20);
            setWrapperHeight(sizes.height - 100);
          }

          return null;
        });
      });
      observer.observe(element);
    }
    return () => (observer ? observer.disconnect() : null);
  }, [element]);

  useDragResize({
    resolution,
    scale,
    widthAndHeightResizer,
    setResolution: actions.setResolution,
    setInputWidth,
    setInputHeight,
  });

  useEffect(() => {
    const [w, h] = resolution;
    setWidth(w + 'px');
    setHeight(h + 'px');
    let scaleToSet = 1;

    if (w > wrapperWidth) {
      scaleToSet = wrapperWidth / w;
    }

    if (h > wrapperHeight) {
      const heightToSet = wrapperHeight / h;
      if (heightToSet < scaleToSet) {
        scaleToSet = heightToSet;
      }
    }

    setScale(scaleToSet);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolution, wrapperWidth, wrapperHeight]);

  const [resolutionWidth, resolutionHeight] = resolution;

  const exists = Boolean(
    Object.keys(presets).find(preset => isEqual(resolution, presets[preset]))
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    // @ts-ignore
    debounce(([w, h]) => actions.setResolution([w, h]), 200),
    []
  );

  const changeValues = (w: number, h: number) => {
    setInputWidth(w);
    setInputHeight(h);
    // @ts-ignore
    debouncedSave([w, h]);
  };

  return (
    <>
      <Wrapper
        paddingTop={4}
        paddingX={6}
        style={{ display: on ? 'block' : 'none' }}
      >
        <Stack justify="center" paddingBottom={2} align="center" gap={2}>
          <Stack gap={2} align="center">
            {exists && canChangePresets ? (
              <Button
                variant="link"
                style={{ padding: 0 }}
                autoWidth
                onClick={actions.openDeletePresetModal}
              >
                <DeleteIcon />
              </Button>
            ) : null}
            {!exists && canChangePresets ? (
              <Button
                variant="link"
                style={{ padding: 0 }}
                autoWidth
                onClick={actions.openAddPresetModal}
              >
                <AddIcon color={theme['sideBar.foreground']} />
              </Button>
            ) : null}
            <Stack align="center" gap={1}>
              <Text style={{ userSelect: 'none' }} size={3}>
                <Input
                  type="number"
                  style={{ height: 20 }}
                  value={inputWidth}
                  onChange={e =>
                    changeValues(parseInt(e.target.value, 10), resolutionHeight)
                  }
                />{' '}
              </Text>
              <Button
                style={{ padding: 0 }}
                variant="link"
                autoWidth
                onClick={() =>
                  actions.setResolution(json(resolution).reverse())
                }
              >
                <SwitchIcon color={theme['sideBar.foreground']} />
              </Button>{' '}
              <Input
                onChange={e =>
                  changeValues(resolutionWidth, parseInt(e.target.value, 10))
                }
                type="number"
                style={{ height: 20 }}
                value={inputHeight}
              />
            </Stack>
          </Stack>
          <PresetMenu
            openEditPresets={actions.toggleEditPresets}
            onSelect={preset => actions.setResolution(preset)}
            theme={theme}
            resolution={resolution}
            presets={presets}
            canChangePresets={canChangePresets}
          />
        </Stack>
      </Wrapper>
      <ResizeHandles
        on={on}
        width={width}
        height={height}
        scale={scale}
        widthAndHeightResizer={widthAndHeightResizer}
        widthResizer={widthResizer}
        heightResizer={heightResizer}
      >
        {children}
      </ResizeHandles>
    </>
  );
};
