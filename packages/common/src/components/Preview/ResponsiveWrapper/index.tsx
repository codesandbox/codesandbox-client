import { Stack, Text, Button, Input } from '@codesandbox/components';
import { json } from 'overmind';
import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash-es';

import { AddIcon, DeleteIcon, SwitchIcon } from './Icons';
import { ResponsiveWrapperProps } from './types';
import { PresetMenu } from './PresetMenu';
import { useDragResize } from './useDragResize';
import { Wrapper } from './elements';
import { ResizeHandles } from './ResizeHandles';

const MIN_SIZE = 100;

export const ResponsiveWrapper = ({
  on,
  canChangePresets,
  props: { theme, state, actions },
  children,
}: ResponsiveWrapperProps) => {
  const {
    responsive: { scale: defaultScale, resolution, presets },
  } = state;
  const element = document.getElementById('sandbox-preview-container');
  const [wrapperWidth, setWrapperWidth] = useState(element?.clientWidth - 20);
  const [wrapperHeight, setWrapperHeight] = useState(
    element?.clientHeight - 100
  );
  const widthAndHeightResizer = useState<{ x: number; y: number } | null>(null);
  const widthResizer = useState<{ x: number } | null>(null);
  const heightResizer = useState<{ y: number } | null>(null);

  const [resolutionWidth, resolutionHeight] = resolution;
  const minResolutionWidth = Math.max(resolutionWidth || MIN_SIZE, MIN_SIZE);
  const minResolutionHeight = Math.max(resolutionHeight || MIN_SIZE, MIN_SIZE);

  let scale = defaultScale / 100;

  if (minResolutionWidth > wrapperWidth) {
    scale = wrapperWidth / minResolutionWidth;
  }

  if (minResolutionHeight > wrapperHeight) {
    const heightToSet = wrapperHeight / minResolutionHeight;
    if (heightToSet < scale) {
      scale = heightToSet;
    }
  }

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
    resizer: widthAndHeightResizer,
    setResolution: actions.setResolution,
  });

  useDragResize({
    resolution,
    scale,
    resizer: widthResizer,
    setResolution: actions.setResolution,
  });

  useDragResize({
    resolution,
    scale,
    resizer: heightResizer,
    setResolution: actions.setResolution,
  });

  const exists = Boolean(
    Object.keys(presets).find(preset => isEqual(resolution, presets[preset]))
  );

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
                disabled={
                  isNaN(resolutionWidth) ||
                  resolutionWidth < MIN_SIZE ||
                  isNaN(resolutionHeight) ||
                  resolutionHeight < MIN_SIZE
                }
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
                  value={isNaN(resolutionWidth) ? '' : resolutionWidth}
                  onChange={e =>
                    actions.setResolution([
                      parseInt(e.target.value, 10),
                      resolutionHeight,
                    ])
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
                  actions.setResolution([
                    resolutionWidth,
                    parseInt(e.target.value, 10),
                  ])
                }
                type="number"
                style={{ height: 20 }}
                value={isNaN(resolutionHeight) ? '' : resolutionHeight}
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
        width={minResolutionWidth + 'px'}
        height={minResolutionHeight + 'px'}
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
