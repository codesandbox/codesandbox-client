import React from 'react';
import { useOvermind } from 'app/overmind';
import { Text } from '@codesandbox/components';
import {
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  Rule,
} from '../../elements';

export const PreviewSettings: React.FC = () => {
  const { state, actions } = useOvermind();
  const bindValue = name => ({
    value: state.preferences.settings[name],
    setValue: value =>
      actions.preferences.settingChanged({
        name,
        value,
      }),
  });

  return (
    <div>
      <Text size={4} marginBottom={6} block variant="muted" weight="bold">
        Preview
      </Text>

      <SubContainer>
        <PreferenceContainer>
          <PaddedPreference
            title="Preview on edit"
            type="boolean"
            {...bindValue('livePreviewEnabled')}
            tooltip="Only update on save"
          />
          <Text size={2} variant="muted">
            Preview the latest code without saving.
          </Text>
          <Rule />
          <PaddedPreference
            title="Clear console"
            type="boolean"
            {...bindValue('clearConsoleEnabled')}
            tooltip="Clear console when executing"
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
