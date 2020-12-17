import React from 'react';
import { Element, List } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Profile } from './Profile';

export const Profiles = () => {
  const {
    state: {
      preferences: { settingsSync },
    },
  } = useOvermind();

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
