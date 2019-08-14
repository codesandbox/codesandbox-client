import React from 'react';
import { inject, observer } from 'app/componentConnectors';

import {
  Title,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
  Rule,
} from '../../elements';
import VSCodePlaceholder from '../../VSCodePlaceholder';

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isFF = navigator.userAgent.toLowerCase().includes('firefox');

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
        <VSCodePlaceholder>
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
            <VSCodePlaceholder hideTitle>
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
            </VSCodePlaceholder>
          </PreferenceContainer>
        </VSCodePlaceholder>
        {/* {Vim mode does not work on FF or Safari */}
        <PreferenceContainer disabled={isSafari || isFF}>
          <PaddedPreference
            title="VIM Mode"
            type="boolean"
            {...bindValue('vimMode')}
          />
          <SubDescription>
            This will enable the VSCodeVim extension, you need to reload the
            page to see the effects
          </SubDescription>
        </PreferenceContainer>
        {isSafari || isFF ? (
          <SubDescription
            css={`
              margin-top: 0.5rem;
            `}
          >
            The VIM extension currently only works on Chrome and Microsoft Edge.
          </SubDescription>
        ) : null}
      </SubContainer>
    </div>
  );
}

export default inject('store', 'signals')(observer(EditorSettings));
