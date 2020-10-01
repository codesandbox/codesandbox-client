import React from 'react';
import { isEqual } from 'lodash-es';
import { Element, Menu, Text } from '@codesandbox/components';
import { ArrowDown } from './Icons';
import { ResponsiveWrapperProps } from './types';

type PresetMenuProps = {
  presets: ResponsiveWrapperProps['props']['state']['responsive']['presets'];
  theme: ResponsiveWrapperProps['props']['theme'];
  resolution: ResponsiveWrapperProps['props']['state']['responsive']['resolution'];
  onSelect: (preset: [number, number]) => void;
  openEditPresets: () => void;
};

export const PresetMenu = ({
  presets,
  theme,
  resolution,
  onSelect,
  openEditPresets,
}: PresetMenuProps) => {
  const activePresetName =
    Object.keys(presets).find(preset => isEqual(presets[preset], resolution)) ||
    'Custom';

  return (
    <Menu>
      <Menu.Button
        style={{
          color: theme['sideBar.foreground'],
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Text>{activePresetName}</Text>
        <Element marginLeft={1}>
          <ArrowDown color={theme['sideBar.foreground']} />
        </Element>
      </Menu.Button>
      <Menu.List>
        {Object.keys(presets).map(preset => (
          <Menu.Item
            key={preset}
            field={preset}
            onSelect={() => onSelect(presets[preset])}
          >
            {preset}
          </Menu.Item>
        ))}
        <Menu.Item
          key="edit-presets"
          field="edit-presets"
          onSelect={openEditPresets}
        >
          Edit Presets
        </Menu.Item>
      </Menu.List>
    </Menu>
  );
};
