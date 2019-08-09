import React from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import { inject, hooksObserver } from 'app/componentConnectors';
import { Action } from './Action';

export const PreferencesButton = inject('signals')(
  hooksObserver(({ signals: { modalOpened } }) => (
    <Action
      onClick={() => modalOpened({ modal: 'preferences' })}
      tooltip="Preferences"
      Icon={SettingsIcon}
    />
  ))
);
