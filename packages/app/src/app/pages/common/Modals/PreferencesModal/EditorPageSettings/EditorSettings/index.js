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
            title="VIM mode"
            type="boolean"
            {...bindValue('vimMode')}
          />
          <SubDescription>
            This will override Use CodeMirror setting as Monaco doesn{"'"}t have
            a VIM mode yet.
          </SubDescription>
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
            title="Font ligatures enabled"
            type="boolean"
            {...bindValue('enableLigatures')}
          />
          <SubDescription>
            Whether we should enable{' '}
            <a
              href="https://en.wikipedia.org/wiki/Typographic_ligature"
              target="_blank"
              rel="noopener noreferrer"
            >
              font ligatures
            </a>.
          </SubDescription>
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
