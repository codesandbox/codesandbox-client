import React, { FunctionComponent, useEffect } from 'react';
import css from '@styled-system/css';
import { Text, Stack, Icon, Element } from '@codesandbox/components';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { SpinnerWrapper } from '@codesandbox/common/lib/components/Preview/Navigator/elements';
import track from '@codesandbox/common/lib/utils/analytics';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import { SubContainer } from '../elements';
import { CreateProfile } from './CreateProfile';
import { Profiles } from './Profiles';

export const PreferencesSync: FunctionComponent = () => {
  const { settingsSync } = useAppState().preferences;
  const { getUserSettings, updateServerSettings } = useActions().preferences;
  const { notificationToast } = useEffects();

  useEffect(() => {
    if (!settingsSync.settings) {
      getUserSettings();
    }
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
    track('Preferences Profiles - Create Import');
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
        notificationToast.error('JSON file not formatted correctly');
      }

      if (!contents || !contents.themeData || !contents.vscode) {
        notificationToast.error('JSON file not formatted correctly');

        return;
      }

      updateServerSettings(file);
    };

    fileSelector.click();
  }, [notificationToast, updateServerSettings]);

  return (
    <>
      <Stack justify="space-between" align="baseline">
        <Text block marginBottom={6} size={4} weight="regular">
          Preferences Profiles
        </Text>
        {settingsSync.settings?.length ? (
          <Tooltip content="Import preferences as a JSON">
            <Element
              as="button"
              type="button"
              css={css({
                padding: 0,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'sideBar.foreground',
              })}
              onClick={importFile}
            >
              <svg width={16} height={14} fill="none" viewBox="0 0 16 14">
                <path
                  fill="currentColor"
                  d="M12.432 2.811a2.334 2.334 0 012.094 2.137A2.667 2.667 0 0113.333 10H9.667V7.204l1.602 1.716 1.462-1.364L8.667 3.2 4.602 7.556 6.064 8.92l1.603-1.716V10H2v-.024a2.334 2.334 0 01-.506-4.487 2.333 2.333 0 012.979-2.59 4.202 4.202 0 017.959-.088zM8 10h1.333v4H8v-4z"
                />
              </svg>
            </Element>
          </Tooltip>
        ) : null}
      </Stack>
      {!settingsSync.settings || settingsSync.fetching ? (
        <Stack
          align="center"
          justify="center"
          css={css({
            width: '100%',
            height: 382,
          })}
        >
          <SpinnerWrapper
            style={{ transformOrigin: '50% 50%', width: 14, height: 14 }}
          >
            <Icon name="spinner" />
          </SpinnerWrapper>
        </Stack>
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
