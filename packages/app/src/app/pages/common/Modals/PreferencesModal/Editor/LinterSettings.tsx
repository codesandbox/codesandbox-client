import { Preference } from '@codesandbox/common/lib/components/Preference';
import { Settings } from '@codesandbox/common/lib/components/Preview/types';
import { Text } from '@codesandbox/components';
import React from 'react';
import { useAppState, useActions } from 'app/overmind';

import { PreferenceContainer } from '../elements';

const SETTING_KEY: keyof Settings = 'lintEnabled';

export const LinterSettings: React.FC = () => {
  const { settingChanged } = useActions().preferences;
  const { settings } = useAppState().preferences;

  return (
    <PreferenceContainer>
      <Preference
        title="Enable linting"
        type="boolean"
        setValue={(value: boolean) => {
          settingChanged({ name: SETTING_KEY, value });
        }}
        value={settings[SETTING_KEY]}
      />

      <Text
        block
        marginTop={2}
        size={2}
        style={{ maxWidth: '60%', lineHeight: 1.5 }}
        variant="muted"
      >
        Show eslint warnings and errors in the editor
      </Text>
    </PreferenceContainer>
  );
};
