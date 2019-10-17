import React from 'react';
import { useOvermind } from 'app/overmind';

import {
  Title,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
  Rule,
} from '../../elements';

export const PreviewSettings: React.FC = () => {
  const {
    state: {
      preferences: { settings },
    },
    actions: {
      preferences: { settingChanged },
    },
  } = useOvermind();

  const bindValue = (name: string) => ({
    value: settings[name],
    setValue: (value: any) => settingChanged({ name, value }),
  });

  return (
    <div>
      <Title>Preview</Title>

      <SubContainer>
        <PreferenceContainer>
          <PaddedPreference
            title="Preview on edit"
            type="boolean"
            {...bindValue('livePreviewEnabled')}
            tooltip="Only update on save"
          />
          <SubDescription>
            Preview the latest code without saving.
          </SubDescription>
          <Rule />
          <PaddedPreference
            title="Clear console"
            type="boolean"
            {...bindValue('clearConsoleEnabled')}
            tooltip="Clear console when executing"
          />
          <SubDescription>
            Clear your developer console between every execution.
          </SubDescription>
          <Rule />
          <PaddedPreference
            title="Instant preview"
            type="boolean"
            {...bindValue('instantPreviewEnabled')}
          />
          <SubDescription>Show preview on every keypress.</SubDescription>
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
};
