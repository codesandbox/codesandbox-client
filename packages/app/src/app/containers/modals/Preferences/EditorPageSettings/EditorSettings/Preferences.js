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
        signals.editor.preferences.preferenceChanged({
          name,
          value,
        }),
    });

    return (
      <Container>
        <PreferenceContainer>
          <PaddedPreference
            title="Zen Mode"
            type="boolean"
            {...bindValue('zenMode')}
          />
          <Description>
            Hide all distracting elements, perfect for lessons and
            presentations.
          </Description>
          <Rule />
          <PaddedPreference
            title="Use CodeMirror"
            type="boolean"
            {...bindValue('codeMirror')}
          />
          <Description>Use CodeMirror instead of Monaco editor.</Description>
          <Rule />
          <PaddedPreference
            title="Automatic Type Acquisition"
            type="boolean"
            {...bindValue('autoDownloadTypes')}
          />
          <Description>
            Automatically download type definitions for dependencies.
          </Description>
          <Rule />
          <PaddedPreference
            title="Prettify on save"
            type="boolean"
            tooltip="Made possible by Prettier"
            {...bindValue('prettifyOnSaveEnabled')}
          />
          <Description>Format all code on save with prettier.</Description>
          <Rule />
          <PaddedPreference
            title="VIM mode"
            type="boolean"
            {...bindValue('vimMode')}
          />
          <Rule />
          <PaddedPreference
            title="Font size"
            type="number"
            {...bindValue('fontSize')}
          />
          <Rule />
          <PaddedPreference
            title="Font family"
            type="string"
            placeholder="Source Code Pro"
            {...bindValue('fontFamily')}
          />
          <Rule />
          <PaddedPreference
            title="Line height"
            type="number"
            placeholder="1.15"
            step="0.05"
            style={{ width: '4rem' }}
            {...bindValue('lineHeight')}
          />
        </PreferenceContainer>
      </Container>
    );
  })
);
