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
            title="Zen Mode"
            type="boolean"
            {...bindValue('zenMode')}
          />
          <SubDescription>
            Hide all distracting elements, perfect for lessons and
            presentations.
          </SubDescription>
          <Rule />
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
            title="Prettify on save"
            type="boolean"
            tooltip="Made possible by Prettier"
            {...bindValue('prettifyOnSaveEnabled')}
          />
          <SubDescription>
            Format all code on save with prettier.
          </SubDescription>
          <Rule />
          <PaddedPreference
            title="Cerebral Debugger"
            type="boolean"
            {...bindValue('connectDebugger')}
          />
          <SubDescription>
            <a
              href="https://cerebraljs.com/docs/introduction/debugger.html#debugger-install"
              target="_new"
            >
              Download Cerebral debugger
            </a>{' '}
            and create an app on port <b>8383</b>. Refresh Codesandbox and get
            insight into how it works
          </SubDescription>
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
      </SubContainer>
    </div>
  );
}

export default inject('store', 'signals')(observer(EditorSettings));
