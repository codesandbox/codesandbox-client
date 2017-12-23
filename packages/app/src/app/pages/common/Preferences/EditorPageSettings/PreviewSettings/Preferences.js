import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  Container,
  PreferenceContainer,
  PaddedPreference,
  Description,
  Rule,
} from '../../styles';

export default inject('store', 'signals')(
  observer(({ store, signals }) => {
    const bindValue = name => ({
      value: store.editor.preferences.settings[name],
      setValue: value =>
        signals.editor.preferences.settingChanged({
          name,
          value,
        }),
    });
    return (
      <Container>
        <PreferenceContainer>
          <PaddedPreference
            title="Preview on edit"
            type="boolean"
            {...bindValue('livePreviewEnabled')}
            tooltip="Only update on save"
          />
          <Description>Preview the latest code without saving.</Description>
          <Rule />
          <PaddedPreference
            title="Clear console"
            type="boolean"
            {...bindValue('clearConsoleEnabled')}
            tooltip="Clear console when executing"
          />
          <Description>
            Clear your developer console between every execution.
          </Description>
          <Rule />
          <PaddedPreference
            title="Instant preview"
            type="boolean"
            {...bindValue('instantPreviewEnabled')}
          />
          <Description>Show preview on every keypress.</Description>
        </PreferenceContainer>
      </Container>
    );
  })
);
