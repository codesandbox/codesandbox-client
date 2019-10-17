import React, { useMemo } from 'react';
import { useOvermind } from 'app/overmind';

import {
  Title,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
  Rule,
} from '../../elements';
import VSCodePlaceholder from '../../VSCodePlaceholder';

const isSafari: boolean = /^((?!chrome|android).)*safari/i.test(
  navigator.userAgent
);
const isFF: boolean = navigator.userAgent.toLowerCase().includes('firefox');

export const EditorSettings: React.FC = () => {
  const {
    state: {
      preferences: { settings },
    },
    actions: {
      preferences: { settingChanged },
    },
  } = useOvermind();

  const bindValue = useMemo(
    () => (name: string) => ({
      value: settings[name],
      setValue: (value: any) =>
        settingChanged({
          name,
          value,
        }),
    }),
    [settings, settingChanged]
  );

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
};
