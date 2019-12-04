import React, { FunctionComponent } from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';

import { useOvermind } from 'app/overmind';

import { Action } from './Action';

export const PreferencesButton: FunctionComponent = () => {
  const {
    actions: { modalOpened },
  } = useOvermind();

  return (
    <Action
      Icon={SettingsIcon}
      onClick={() => modalOpened({ modal: 'preferences' })}
      tooltip="Preferences"
    />
  );
};
