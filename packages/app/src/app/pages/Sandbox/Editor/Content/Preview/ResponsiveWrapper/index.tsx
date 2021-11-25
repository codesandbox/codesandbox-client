import {
  Stack,
  Text,
  Button,
  Input,
  ThemeProvider,
  IconButton,
} from '@codesandbox/components';
import ResizeObserver from 'resize-observer-polyfill';
import track from '@codesandbox/common/lib/utils/analytics';
import css from '@styled-system/css';
import { json } from 'overmind';
import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash-es';

import { useTheme } from 'styled-components';
import { useAppState, useActions } from 'app/overmind';
import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { SwitchIcon } from './Icons';
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
import { PreviewCommentWrapper } from './PreviewCommentWrapper';

export const ResponsiveWrapper = ({ children }: ResponsiveWrapperProps) => {
  const {
    preview: {
      responsive: { resolution, scale: stateScale, presets },
      mode,
    },
    editor,
  } = useAppState();
  const {
    checkURLParameters,
    openDeletePresetModal,
    openAddPresetModal,
    setResolution,
    toggleEditPresets,
    setIsResizing
  } = useActions().preview;

  const theme = useTheme();
  const canChangePresets = hasPermission(
    editor.currentSandbox!.authorization,
    'write_code'
  );
  const on = mode === 'responsive' || mode === 'responsive-add-comment';

  const element = document.getElementById('styled-resize-wrapper');
  const [wrapperWidth, setWrapperWidth] = useState(
    element?.getBoundingClientRect().width
  );
  const [wrapperHeight, setWrapperHeight] = useState(
    element?.getBoundingClientRect().height
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

  let scale = stateScale / 100;

  const hasHeightMostSpace =
    wrapperWidth - resolutionWidth < wrapperHeight - resolutionHeight;

  if (hasHeightMostSpace && minScaleResolutionWidth > wrapperWidth) {
    scale = (wrapperWidth - PADDING_OFFSET_X) / minScaleResolutionWidth;
  } else if (minScaleResolutionHeight > wrapperHeight) {
    scale = (wrapperHeight - PADDING_OFFSET_Y) / minScaleResolutionHeight;
  }

  useEffect(() => {
    let observer;
    if (element) {
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
    Object.keys(presets).find(preset => isEqual(resolution, presets[preset]))
  );

  useEffect(() => {
    checkURLParameters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    // @ts-ignore
    <ThemeProvider theme={theme.vscodeTheme}>
      <Wrapper paddingX={6} css={css({ display: on ? 'block' : 'none' })}>
        <Stack justify="center" paddingY={2} align="center" gap={2}>
          <Stack gap={2} align="center">
            {exists ? (
              <IconButton
                title="Remove Preset"
                name="close"
                onClick={openDeletePresetModal}
              />
            ) : null}
            {!exists ? (
              <IconButton
                disabled={
                  isNaN(resolutionWidth) ||
                  resolutionWidth < MIN_SIZE_X ||
                  isNaN(resolutionHeight) ||
                  resolutionHeight < MIN_SIZE_Y
                }
                title="Add Preset"
                name="add"
                onClick={openAddPresetModal}
              />
            ) : null}
            <Stack align="center" gap={1}>
              <Text style={{ userSelect: 'none' }} size={3}>
                <Input
                  type="number"
                  css={css({
                    height: 20,
                    paddingRight: 0,
                    '::-webkit-inner-spin-button': { padding: '12px 0' },
                  })}
                  value={
                    isNaN(resolutionWidth)
                      ? ''
                      : widthResizer[0]?.x ||
                        widthAndHeightResizer[0]?.x ||
                        resolutionWidth
                  }
                  onChange={e =>
                    setResolution([
                      parseInt(e.target.value, 10),
                      resolutionHeight,
                    ])
                  }
                />{' '}
              </Text>
              <Button
                css={css({ padding: 0 })}
                variant="link"
                autoWidth
                onClick={() =>
                  setResolution(json(resolution).reverse() as [number, number])
                }
              >
                <SwitchIcon color={theme['sideBar.foreground']} />
              </Button>{' '}
              <Input
                onChange={e =>
                  setResolution([resolutionWidth, parseInt(e.target.value, 10)])
                }
                type="number"
                css={css({
                  height: 20,
                  paddingRight: 0,
                  '::-webkit-inner-spin-button': { padding: '12px 0' },
                })}
                value={
                  isNaN(resolutionHeight)
                    ? ''
                    : heightResizer[0]?.y ||
                      widthAndHeightResizer[0]?.y ||
                      resolutionHeight
                }
              />
            </Stack>
            <Text size={3}>
              (
              {Math.ceil(scale * 100) === 100
                ? '1x'
                : `${(Math.ceil(scale * 100) / 100).toFixed(2)}x`}
              )
            </Text>
          </Stack>
          <PresetMenu
            openEditPresets={toggleEditPresets}
            onSelect={preset => {
              track('Responsive Preview - Preset Changed', {
                width: preset[0],
                height: preset[1],
              });
              setResolution(preset);
            }}
            theme={theme}
            resolution={resolution}
            presets={presets}
            canChangePresets={canChangePresets}
          />
        </Stack>
      </Wrapper>
      <ResizeHandles
        on={on}
        showResizeHandles={mode === 'responsive'}
        width={minResolutionWidth}
        height={minResolutionHeight}
        wrapper={element as any}
        scale={scale}
        setResolution={setResolution}
        widthAndHeightResizer={widthAndHeightResizer}
        widthResizer={widthResizer}
        heightResizer={heightResizer}
        setIsResizing={setIsResizing}
      >
        <PreviewCommentWrapper scale={on ? scale : 1}>
          {children}
        </PreviewCommentWrapper>
      </ResizeHandles>
    </ThemeProvider>
  );
};
