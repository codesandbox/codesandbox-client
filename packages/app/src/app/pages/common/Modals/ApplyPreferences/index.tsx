import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';
import { Alert } from '../Common/Alert';

export const ApplyPrefrences: FunctionComponent = () => {
  const {
    actions: { modalClosed, preferences },
  } = useOvermind();

  return (
    <Alert
      title="Apply Preferences"
      description="Are you sure you want to apply the preferences? This will delete your current ones and reload the page"
      onCancel={modalClosed}
      onPrimaryAction={preferences.applyPreferences}
      confirmMessage="Apply"
    />
  );
};
