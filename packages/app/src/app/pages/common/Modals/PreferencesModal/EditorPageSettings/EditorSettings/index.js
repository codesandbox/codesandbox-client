import React from 'react';
import { inject, observer } from 'mobx-react';

import {
  Title,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
  Rule,
} from '../../elements';

function EditorSettings({ store, signals }) {
  const bindValue = name => ({
    value: store.preferences.settings[name],
    setValue: value =>
      signals.preferences.settingChanged({
        name,
        value,
      }),
  });

  return (
    <div>
      <Title>Editor</Title>

      <SubContainer>
        <PreferenceContainer>
          <PaddedPreference
            title="Use CodeMirror"
            type="boolean"
            {...bindValue('codeMirror')}
          />
          <SubDescription>
            Use CodeMirror instead of Monaco editor.
          </SubDescription>
          <Rule />
          <PaddedPreference
            title="Automatic Type Acquisition"
            type="boolean"
            {...bindValue('autoDownloadTypes')}
          />
          <SubDescription>
            Automatically download type definitions for dependencies.
          </SubDescription>
          <Rule />
          <PaddedPreference
            title="ESLint"
            type="boolean"
            tooltip="Made possible by ESLint"
            {...bindValue('lintEnabled')}
          />
          <SubDescription>
            Whether linting as you type should be enabled.
          </SubDescription>
          <Rule />
          <PaddedPreference
            title="Prettify On Save"
            type="boolean"
            tooltip="Made possible by Prettier"
            {...bindValue('prettifyOnSaveEnabled')}
          />
          <SubDescription>
            Format all code on save with prettier.
          </SubDescription>
          <Rule />
          <PaddedPreference
            title="VIM Mode"
            type="boolean"
            {...bindValue('vimMode')}
          />
          <SubDescription>
            This will override Use CodeMirror setting as Monaco doesn{"'"}t have
            a VIM mode yet.
          </SubDescription>
        </PreferenceContainer>
      </SubContainer>
    </div>
  );
}

export default inject('store', 'signals')(observer(EditorSettings));
