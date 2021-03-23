import { Text } from '@codesandbox/components';
import React, { FunctionComponent } from 'react';
import { useAppState, useActions } from 'app/overmind';

import { Rule } from '../../elements';

import { PreferenceText } from './elements';

export const EditorTheme: FunctionComponent = () => {
  const { settings } = useAppState().preferences;
  const { settingChanged } = useActions().preferences;

  const bindValue = (name: string, setUndefined?: boolean) => ({
    setValue: value => settingChanged({ name, value }),
    value: setUndefined ? settings[name] || undefined : settings[name],
  });

  return (
    <div>
      <Text block marginBottom={2} marginTop={8} size={3}>
        Editor Theme
      </Text>

      <Text block size={3} variant="muted">
        You can select your editor theme by selecting File {'->'} Preferences{' '}
        {'->'} Color Theme in the menu bar.
      </Text>

      <Rule />

      <Text block marginBottom={2} size={3}>
        Custom VSCode Theme
      </Text>

      <Text block marginBottom={4} size={3} variant="muted">
        {`After changing this setting you'll have to reload the browser and select 'Custom' as your color theme.`}
      </Text>

      <PreferenceText
        block
        isTextArea
        placeholder={`You can use your own theme from VSCode directly:
1. Open VSCode
2. Press (CMD or CTRL) + SHIFT + P
3. Enter: '> Developer: Generate Color Scheme From Current Settings'
4. Copy the contents and paste them here!`}
        rows={7}
        style={{ minHeight: 130 }}
        {...bindValue('manualCustomVSCodeTheme', true)}
      />
    </div>
  );
};
