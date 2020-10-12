import {
  Stack,
  Text,
  Button,
  Input,
  ThemeProvider,
} from '@codesandbox/components';
import { json } from 'overmind';
import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash-es';

import { useTheme } from 'styled-components';
import { useOvermind } from 'app/overmind';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { AddIcon, DeleteIcon, SwitchIcon } from './Icons';
import { ResponsiveWrapperProps } from './types';
import { PresetMenu } from './PresetMenu';
import {
  Wrapper,
  PADDING_OFFSET_X,
  PADDING_OFFSET_Y,
  MIN_SIZE_X,
  MIN_SIZE_Y,
} from './elements';
import { ResizeHandles } from './ResizeHandles';

export const ResponsiveWrapper = ({ children }: ResponsiveWrapperProps) => {
  const overmind = useOvermind();
  const state = overmind.state.preview.responsive;
  const actions = overmind.actions.preview;
  const theme = useTheme();
  const canChangePresets = hasPermission(
    overmind.state.editor.currentSandbox!.authorization,
    'write_code'
  );
  const on = overmind.state.preview.mode === 'responsive';
  const resolution = state.resolution;
  const element = document.getElementById('sandbox-preview-container');
  const [wrapperWidth, setWrapperWidth] = useState(
    element?.clientWidth - PADDING_OFFSET_X
  );
  const [wrapperHeight, setWrapperHeight] = useState(
    element?.clientHeight - PADDING_OFFSET_Y
  );
  const widthAndHeightResizer = useState<{ x: number; y: number } | null>(null);
  const widthResizer = useState<{ x: number } | null>(null);
  const heightResizer = useState<{ y: number } | null>(null);
  const [resolutionWidth, resolutionHeight] = resolution;

  const minScaleResolutionWidth = Math.max(
    resolutionWidth || MIN_SIZE_X,
    MIN_SIZE_X
  );
  const minScaleResolutionHeight = Math.max(
    resolutionHeight || MIN_SIZE_Y,
    MIN_SIZE_Y
  );

  const minResolutionWidth = Math.max(
    widthResizer[0]?.x ||
      widthAndHeightResizer[0]?.x ||
      resolutionWidth ||
      MIN_SIZE_X,
    MIN_SIZE_X
  );
  const minResolutionHeight = Math.max(
    heightResizer[0]?.y ||
      widthAndHeightResizer[0]?.y ||
      resolutionHeight ||
      MIN_SIZE_Y,
    MIN_SIZE_Y
  );

  let scale = state.scale / 100;

  if (minScaleResolutionWidth > wrapperWidth - PADDING_OFFSET_X) {
    scale = (wrapperWidth - PADDING_OFFSET_X) / minScaleResolutionWidth;
  }

  if (minScaleResolutionHeight > wrapperHeight - PADDING_OFFSET_Y) {
    scale = Math.min(
      (wrapperHeight - PADDING_OFFSET_Y) / minScaleResolutionHeight,
      scale
    );
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

            setWrapperWidth(sizes.width - PADDING_OFFSET_X);
            setWrapperHeight(sizes.height - PADDING_OFFSET_Y);
          }

          return null;
        });
      });
      observer.observe(element);
    }
    return () => (observer ? observer.disconnect() : null);
  }, [element]);

  const exists = Boolean(
    Object.keys(state.presets).find(preset =>
      isEqual(resolution, state.presets[preset])
    )
  );

  return (
    // @ts-ignore
    <ThemeProvider theme={theme.vscodeTheme}>
      <Wrapper paddingX={6} style={{ display: on ? 'block' : 'none' }}>
        <Stack justify="center" paddingY={2} align="center" gap={2}>
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
                  resolutionWidth < MIN_SIZE_X ||
                  isNaN(resolutionHeight) ||
                  resolutionHeight < MIN_SIZE_Y
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
                  value={
                    isNaN(resolutionWidth)
                      ? ''
                      : widthResizer[0]?.x ||
                        widthAndHeightResizer[0]?.x ||
                        resolutionWidth
                  }
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
                  actions.setResolution(
                    json(resolution).reverse() as [number, number]
                  )
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
                value={
                  isNaN(resolutionHeight)
                    ? ''
                    : heightResizer[0]?.y ||
                      widthAndHeightResizer[0]?.y ||
                      resolutionHeight
                }
              />
            </Stack>
            <Text size={3}>({Math.floor(scale * 100)}%)</Text>
          </Stack>
          <PresetMenu
            openEditPresets={actions.toggleEditPresets}
            onSelect={preset => actions.setResolution(preset)}
            theme={theme}
            resolution={resolution}
            presets={state.presets}
            canChangePresets={canChangePresets}
          />
        </Stack>
      </Wrapper>
      <ResizeHandles
        on={on}
        width={minResolutionWidth}
        height={minResolutionHeight}
        scale={scale}
        setResolution={actions.setResolution}
        widthAndHeightResizer={widthAndHeightResizer}
        widthResizer={widthResizer}
        heightResizer={heightResizer}
      >
        {children}
      </ResizeHandles>
    </ThemeProvider>
  );
};
