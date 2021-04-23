import React from 'react';
import css from '@styled-system/css';
import { isEqual } from 'lodash-es';
import { Element, Menu, Text } from '@codesandbox/components';
import { ArrowDown } from './Icons';

type PresetMenuProps = {
  canChangePresets: boolean;
  presets: { [name: string]: [number, number] };
  theme: any;
  resolution: [number, number];
  onSelect: (preset: [number, number]) => void;
  openEditPresets: () => void;
};

export const PresetMenu = ({
  presets,
  theme,
  resolution,
  onSelect,
  openEditPresets,
  canChangePresets,
}: PresetMenuProps) => {
  const activePresetName =
    Object.keys(presets).find(preset => isEqual(presets[preset], resolution)) ||
    'Custom';

  const sortedPresetsByWidth = Object.keys(presets).sort((a, b) =>
    presets[a][0] > presets[b][0] ? 1 : -1
  );

  return (
    <Menu>
      <Menu.Button
        css={css({
          color: 'sideBar.foreground',
          display: 'flex',
          alignItems: 'center',
        })}
      >
        <Text>{activePresetName}</Text>
        <Element marginLeft={1}>
          <ArrowDown color={theme['sideBar.foreground']} />
        </Element>
      </Menu.Button>
      <Menu.List>
        {sortedPresetsByWidth.map(preset => (
          <Menu.Item
            key={preset}
            field={preset}
            onSelect={() => onSelect(presets[preset])}
          >
            {preset}
          </Menu.Item>
        ))}
        {canChangePresets ? (
          <Menu.Item
            key="edit-presets"
            field="edit-presets"
            onSelect={openEditPresets}
          >
            Edit Presets
          </Menu.Item>
        ) : null}
      </Menu.List>
    </Menu>
  );
};
