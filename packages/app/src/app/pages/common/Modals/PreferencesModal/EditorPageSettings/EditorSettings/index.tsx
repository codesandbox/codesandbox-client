import React from 'react';
import { useOvermind } from 'app/overmind';

import {
  Title,
  SubContainer,
  PreferenceContainer,
  PaddedPreference,
  SubDescription,
} from '../../elements';
import { VSCodePlaceholder } from '../../VSCodePlaceholder';

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

  const bindValue = (name: string) => ({
    value: settings[name],
    setValue: (value: any) => settingChanged({ name, value }),
  });

  return (
    <div>
      <Title>Editor</Title>

      <SubContainer>
        <VSCodePlaceholder />

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
