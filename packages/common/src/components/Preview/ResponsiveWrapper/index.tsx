import { Element, Stack, Text, Button, Input } from '@codesandbox/components';
import { json } from 'overmind';
import React, { useEffect, useState } from 'react';
import { isEqual } from 'lodash-es';

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

  iframe {
    width: ${props => props.width};
    height: ${props => props.height};
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

export const ResponsiveWrapper = ({
  on,
  props: { theme, state, actions },
  children,
}: ResponsiveWrapperProps) => {
  const {
    responsive: { scale: defaultScale, resolution, presets },
  } = state;
  const [width, setWidth] = useState<string>('100%');
  const [height, setHeight] = useState<string>('100%');
  const [scale, setScale] = useState<number>(defaultScale / 100);
  const element = document.getElementById('sandbox-preview-container');
  const [wrapperWidth, setWrapperWidth] = useState(element?.clientWidth - 20);
  const [wrapperHeight, setWrapperHeight] = useState(
    element?.clientHeight - 100
  );

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

  if (!on) return children;

  const [resolutionWidth, resolutionHeight] = resolution;

  const exists = Boolean(
    Object.keys(presets).find(preset => isEqual(resolution, presets[preset]))
  );

  return (
    <>
      <Wrapper paddingTop={4} paddingX={6}>
        <Stack justify="center" paddingBottom={2} align="center" gap={2}>
          <Stack gap={2} align="center">
            {exists ? (
              <Button
                variant="link"
                style={{ padding: 0 }}
                autoWidth
                onClick={actions.openDeletePresetModal}
              >
                <DeleteIcon />
              </Button>
            ) : (
              <Button
                variant="link"
                style={{ padding: 0 }}
                autoWidth
                onClick={actions.openAddPresetModal}
              >
                <AddIcon color={theme['sideBar.foreground']} />
              </Button>
            )}
            <Stack align="center" gap={1}>
              <Text style={{ userSelect: 'none' }} size={3}>
                <Input
                  type="number"
                  style={{ height: 20 }}
                  value={resolutionWidth}
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
                value={resolutionHeight}
              />
            </Stack>
          </Stack>
          <PresetMenu
            openEditPresets={actions.toggleEditPresets}
            onSelect={preset => actions.setResolution(preset)}
            theme={theme}
            resolution={resolution}
            presets={presets}
          />
        </Stack>
      </Wrapper>
      <Styled scale={scale} width={width} height={height}>
        <div>{children}</div>
      </Styled>
    </>
  );
};
