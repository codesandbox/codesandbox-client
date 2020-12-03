import React, { FunctionComponent, useEffect } from 'react';
import { format } from 'date-fns';
import { Text, Element, Button } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

import { SubContainer } from '../elements';

export const PreferencesSync: FunctionComponent = () => {
  const {
    state: {
      preferences: { settingsSync },
    },
    actions,
  } = useOvermind();

  useEffect(() => {
    actions.preferences.getUserSettings();
  }, []);

  const savePreferences = () => actions.preferences.syncSettings();

  const openModal = () => actions.preferences.openApplySettingsModal();

  return (
    <>
      <Text block marginBottom={6} size={4} variant="muted" weight="bold">
        Preferences Sync
      </Text>
      {settingsSync.fetching ? (
        <>Getting your latest saved preferences</>
      ) : (
        <SubContainer>
          <Element paddingTop={2}>
            <Button
              autoWidth
              disabled={settingsSync.syncing}
              onClick={savePreferences}
            >
              Sync
            </Button>
          </Element>

          {settingsSync.settings && (
            <>
              <Text size={4} align="center" weight="bold" paddingTop={4}>
                Your Saved Settings
              </Text>
              {settingsSync.settings.map(setting => (
                <Element marginTop={1}>
                  <Text block>
                    Created at:{' '}
                    {format(new Date(setting.insertedAt), 'dd/MM/yyyy')}
                  </Text>
                  <Text block>
                    Last Updated at:{' '}
                    {format(new Date(setting.updatedAt), 'dd/MM/yyyy')}
                  </Text>
                  <Button
                    marginTop={2}
                    autoWidth
                    disabled={settingsSync.applying}
                    onClick={openModal}
                  >
                    Apply Preferences
                  </Button>
                </Element>
              ))}
            </>
          )}
        </SubContainer>
      )}
    </>
  );
};
