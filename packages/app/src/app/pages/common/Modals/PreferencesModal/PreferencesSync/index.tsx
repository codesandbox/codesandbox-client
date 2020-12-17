import React, { FunctionComponent, useEffect } from 'react';

import { Text, Stack } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

import { SubContainer } from '../elements';
import { CreateProfile } from './CreateProfile';
import { Profiles } from './Profiles';

export const PreferencesSync: FunctionComponent = () => {
  const {
    state: {
      preferences: { settingsSync },
    },
    actions,
    effects,
  } = useOvermind();

  useEffect(() => {
    actions.preferences.getUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const readAsText = (file: File): Promise<string | ArrayBuffer> =>
    new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsText(file);
    });

  const importFile = React.useCallback(() => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'application/json');
    fileSelector.onchange = async event => {
      const target = event.target as HTMLInputElement;
      const file = (await readAsText(target.files[0])) as string;
      let contents;

      try {
        contents = JSON.parse(file);
      } catch {
        effects.notificationToast.error('JSON file not formatted correctly');
      }

      if (!contents || !contents.themeData || !contents.vscode) {
        effects.notificationToast.error('JSON file not formatted correctly');

        return;
      }

      actions.preferences.appllySettings(file);
    };

    fileSelector.click();
  }, []);

  return (
    <>
      <Stack justify="space-between" align="baseline">
        <Text block marginBottom={6} size={4} variant="muted" weight="bold">
          Preferences Sync
        </Text>
        {settingsSync.settings?.length ? (
          <button
            type="button"
            style={{
              padding: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={importFile}
          >
            <svg width={16} height={14} fill="none" viewBox="0 0 16 14">
              <path
                fill="#fff"
                d="M12.432 2.811a2.334 2.334 0 012.094 2.137A2.667 2.667 0 0113.333 10H9.667V7.204l1.602 1.716 1.462-1.364L8.667 3.2 4.602 7.556 6.064 8.92l1.603-1.716V10H2v-.024a2.334 2.334 0 01-.506-4.487 2.333 2.333 0 012.979-2.59 4.202 4.202 0 017.959-.088zM8 10h1.333v4H8v-4z"
              />
            </svg>
          </button>
        ) : null}
      </Stack>
      {settingsSync.fetching ? (
        <>Getting your latest saved preferences</>
      ) : (
        <SubContainer>
          {!settingsSync.settings?.length ? (
            <CreateProfile importFile={importFile} />
          ) : (
            <Profiles />
          )}
        </SubContainer>
      )}
    </>
  );
};
