import { Text } from '@codesandbox/components';
import React from 'react';

import { useAppState, useActions } from 'app/overmind';

import {
  PaddedPreference,
  PreferenceContainer,
  SubContainer,
  Rule,
} from '../elements';

export const Preview: React.FC = () => {
  const { settingChanged } = useActions().preferences;
  const { settings } = useAppState().preferences;

  const bindValue = (name: string) => ({
    setValue: value => settingChanged({ name, value }),
    value: settings[name],
  });

  return (
    <div>
      <Text block marginBottom={6} size={4} weight="bold">
        Preview
      </Text>

      <SubContainer>
        <PreferenceContainer>
          <PaddedPreference
            title="Preview on edit"
            tooltip="Only update on save"
            type="boolean"
            {...bindValue('livePreviewEnabled')}
          />

          <Text size={2} variant="muted">
            Preview the latest code without saving.
          </Text>

          <Rule />

          <PaddedPreference
            title="Clear console"
            tooltip="Clear console when executing"
            type="boolean"
            {...bindValue('clearConsoleEnabled')}
          />

          <Text size={2} variant="muted">
            Clear your developer console between every execution.
          </Text>

          <Rule />

          <PaddedPreference
            title="Instant preview"
            type="boolean"
            {...bindValue('instantPreviewEnabled')}
          />

          <Text size={2} variant="muted">
            Show preview on every keypress.
          </Text>
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
};
