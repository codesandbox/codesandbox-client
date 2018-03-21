import * as React from 'react';
import { connect } from 'app/fluent';

import {
  Title,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
  Rule,
} from '../../elements';

export default connect()
  .with(({ state, signals }) => ({
    settings: state.preferences.settings,
    settingChanged: signals.preferences.settingChanged
  }))
  .to(
    function PreviewSettings({ settings, settingChanged }) {
      const bindValue = name => ({
        value: settings[name],
        setValue: value =>
          settingChanged({
            name,
            value,
          }),
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
    }
  )
