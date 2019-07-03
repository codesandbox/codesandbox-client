import React from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import { useSignals } from 'app/store';
import { Action } from './Action';

export const PreferencesButton = () => {
  const { modalOpened } = useSignals();

  return (
    <Action
      onClick={() => modalOpened({ modal: 'preferences' })}
      tooltip="Preferences"
      Icon={SettingsIcon}
    />
  );
};
