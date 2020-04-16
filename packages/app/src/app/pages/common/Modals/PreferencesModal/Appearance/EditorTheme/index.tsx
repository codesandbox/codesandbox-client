import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';
import { Text } from '@codesandbox/components';

import { Rule } from '../../elements';
import { PreferenceText } from './elements';

export const EditorTheme: FunctionComponent = () => {
  const {
    actions: {
      preferences: { settingChanged },
    },
    state: {
      preferences: { settings },
    },
  } = useOvermind();

  const bindValue = (name: string, setUndefined?: boolean) => ({
    setValue: value => settingChanged({ name, value }),
    value: setUndefined ? settings[name] || undefined : settings[name],
  });

  return (
    <div>
      <Text block size={3} marginTop={8} marginBottom={2}>
        Editor Theme
      </Text>

      <Text variant="muted" size={3} block>
        You can select your editor theme by selecting File {'->'} Preferences{' '}
        {'->'} Color Theme in the menu bar.
      </Text>

      <Rule />

      <Text size={3} marginBottom={2} block>
        Custom VSCode Theme
      </Text>

      <Text variant="muted" size={3} marginBottom={4} block>
        After changing this setting you
        {"'"}
        ll have to reload the browser and select {'"'}
        Custom
        {'"'} as your color theme.
      </Text>

      <PreferenceText
        block
        style={{ minHeight: 130 }}
        isTextArea
        placeholder={`You can use your own theme from VSCode directly:
1. Open VSCode
2. Press (CMD or CTRL) + SHIFT + P
3. Enter: '> Developer: Generate Color Scheme From Current Settings'
4. Copy the contents and paste them here!`}
        rows={7}
        {...bindValue('manualCustomVSCodeTheme', true)}
      />
    </div>
  );
};
