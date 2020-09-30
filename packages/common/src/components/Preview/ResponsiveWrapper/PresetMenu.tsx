import React from 'react';
import { isEqual } from 'lodash-es';
import { Element, Menu, Text } from '@codesandbox/components';
import { ArrowDown } from './Icons';
import { ResponsiveWrapperProps } from './types';

type PresetMenuProps = {
  defaultPresets: ResponsiveWrapperProps['props']['state']['responsive']['defaultPresets'];
  theme: ResponsiveWrapperProps['props']['theme'];
  resolution: ResponsiveWrapperProps['props']['state']['responsive']['resolution'];
  onSelect: (preset: [number, number]) => void;
};

export const PresetMenu = ({
  defaultPresets,
  theme,
  resolution,
  onSelect,
}: PresetMenuProps) => {
  const activePresetName =
    Object.keys(defaultPresets).find(preset =>
      isEqual(defaultPresets[preset], resolution)
    ) || 'Custom';

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
        {Object.keys(defaultPresets).map(preset => (
          <Menu.Item
            key={preset}
            field={preset}
            onSelect={() => onSelect(defaultPresets[preset])}
          >
            {preset}
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  );
};
