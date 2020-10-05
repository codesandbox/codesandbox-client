import { Element, Stack, Text, Button, Input } from '@codesandbox/components';
import { json } from 'overmind';
import React, { useCallback, useEffect, useState } from 'react';
import { isEqual, debounce } from 'lodash-es';

import styled from 'styled-components';
import { AddIcon, DeleteIcon, SwitchIcon } from './Icons';
import { ResponsiveWrapperProps } from './types';
import { PresetMenu } from './PresetMenu';

const Styled = styled(Element)<{
  width: string;
  height: string;
  theme: any;
  scale: number;
}>`
  height: 100%;

  > div {
    overflow: auto;
    margin: auto;
    background: ${props => props.theme['sideBar.background']};
    height: 100%;
    position: relative;
  }

  > div > span {
    width: ${props => props.width};
    height: ${props => props.height};
    transition: all 300ms ease;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(${props => props.scale});
    display: block;
  }
`;

const Wrapper = styled(Element)`
  background: ${props => props.theme['sideBar.background']};

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    width: 50px;
    -moz-appearance: textfield;
  }
`;

const ResizeWrapper = styled.span`
  position: relative;
  padding: 15px;
`;

const CornerResize = styled(Element)`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  background-color: red;
  cursor: nwse-resize;
  z-index: 2;
`;

const WidthResize = styled(Element)`
  position: absolute;
  right: 5px;
  top: calc(50% - 2.5px);
  width: 10px;
  height: 10px;
  background-color: red;
  cursor: ew-resize;
  z-index: 2;
`;

const HeightResize = styled(Element)`
  position: absolute;
  bottom: 5px;
  left: calc(50% - 2.5px);
  width: 10px;
  height: 10px;
  background-color: red;
  cursor: ns-resize;
  z-index: 2;
`;

const Cover = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const useDragResize = (
  resolution: [number, number],
  scale: number,
  [size, setSize]: [{ x?: number; y?: number }, (payload: any) => void],
  setResolution: (resolution: [number, number]) => void
) => {
  useEffect(() => {
    if (size) {
      const initialWidth = resolution[0];
      const initialHeight = resolution[1];
      const mouseMoveListener: (event: MouseEvent) => void = event => {
        setResolution([
          'x' in size
            ? (initialWidth - (size.x - event.clientX) * 2) * (2 - scale)
            : resolution[0],
          'y' in size
            ? (initialHeight - (size.y - event.clientY) * 2) * (2 - scale)
            : resolution[1],
        ]);
      };
      const mouseUpListener: (event: MouseEvent) => void = () => {
        setSize(null);
        window.removeEventListener('mousemove', mouseMoveListener);
        window.removeEventListener('mouseup', mouseUpListener);
      };

      window.addEventListener('mousemove', mouseMoveListener);
      window.addEventListener('mouseup', mouseUpListener);

      return () => {
        window.removeEventListener('mousemove', mouseMoveListener);
        window.removeEventListener('mouseup', mouseUpListener);
      };
    }
    return () => {};
  }, [size]);
};

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

  useDragResize(
    resolution,
    scale,
    widthAndHeightResizer,
    actions.setResolution
  );
  useDragResize(resolution, scale, widthResizer, actions.setResolution);
  useDragResize(resolution, scale, heightResizer, actions.setResolution);

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
      <Styled
        scale={on ? scale : 1}
        width={on ? width : '100%'}
        height={on ? height : '100%'}
      >
        <div>
          <ResizeWrapper>
            <CornerResize
              onMouseDown={event => {
                widthAndHeightResizer[1]({
                  x: event.clientX,
                  y: event.clientY,
                });
              }}
            />
            <WidthResize
              onMouseDown={event => {
                widthResizer[1]({
                  x: event.clientX,
                });
              }}
            />
            <HeightResize
              onMouseDown={event => {
                heightResizer[1]({
                  y: event.clientY,
                });
              }}
            />
            {widthAndHeightResizer[0] || widthResizer[0] || heightResizer[0] ? (
              <Cover />
            ) : null}
            {children}
          </ResizeWrapper>
        </div>
      </Styled>
    </>
  );
};
