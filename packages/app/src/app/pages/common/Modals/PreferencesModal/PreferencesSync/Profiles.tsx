import React from 'react';
import { Element, List } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { Profile } from './Profile';

export const Profiles = () => {
  const { settingsSync } = useAppState().preferences;

  return (
    <Element paddingTop={4}>
      <List>
        {settingsSync.settings.map(setting => (
          <Profile setting={setting} />
        ))}
      </List>
    </Element>
  );
};
