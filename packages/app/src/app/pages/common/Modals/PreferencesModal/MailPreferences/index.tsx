import { Text, Element } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';
import { useAppState, useActions } from 'app/overmind';

import { Rule, SubContainer, PaddedPreference } from '../elements';

export const MailPreferences: FunctionComponent = () => {
  const {
    getNotificationPreferences,
    updateNotificationPreferences,
  } = useActions().userNotifications;
  const { preferences } = useAppState().userNotifications;

  useEffect(() => {
    getNotificationPreferences();
  }, [getNotificationPreferences]);

  return (
    <>
      <Text block marginBottom={6} size={4} weight="regular">
        Notfication Preferences
      </Text>

      {preferences ? (
        <SubContainer>
          <Text block marginBottom={2} size={3} weight="regular">
            Review Notifications
          </Text>

          <Text
            block
            marginTop={2}
            size={2}
            variant="muted"
            style={{ maxWidth: '90%' }}
          >
            In-browser notifications related to pull requests and reviews. These
            will only be sent for repositories that have the GitHub App
            installed and have been imported into any of your teams.
          </Text>

          <Element paddingTop={4}>
            <PaddedPreference
              setValue={(value: boolean) =>
                updateNotificationPreferences({
                  inAppPrReviewReceived: value,
                })
              }
              title="Notify me when someone reviews my pull request"
              tooltip="Notify on review"
              type="boolean"
              value={preferences.inAppPrReviewReceived}
            />
          </Element>
          <Element paddingTop={4}>
            <PaddedPreference
              setValue={(value: boolean) =>
                updateNotificationPreferences({
                  inAppPrReviewRequest: value,
                })
              }
              title="Notify me when someone requests my review on a pull request"
              tooltip="Notify on review request"
              type="boolean"
              value={preferences.inAppPrReviewRequest}
            />
          </Element>
          <Rule />
          <Text block marginTop={4} marginBottom={4} size={3} weight="regular">
            Email Notifications
          </Text>

          <Text block marginTop={2} size={2} variant="muted">
            These notifications will always show in the browser, but receiving
            an email is optional.
          </Text>

          <Element paddingTop={4}>
            <PaddedPreference
              setValue={(value: boolean) =>
                updateNotificationPreferences({
                  emailTeamInvite: value,
                })
              }
              title="Email when someone invites me to a team"
              tooltip="Email on team invite"
              type="boolean"
              value={preferences.emailTeamInvite}
            />
          </Element>
          <Element paddingTop={4}>
            <PaddedPreference
              setValue={(value: boolean) =>
                updateNotificationPreferences({
                  emailSandboxInvite: value,
                })
              }
              title="Email when someone invites me to collaborate on a sandbox"
              tooltip="Email on team invite"
              type="boolean"
              value={preferences.emailSandboxInvite}
            />
          </Element>

          <Rule />
          <Element paddingTop={2}>
            <PaddedPreference
              setValue={(value: boolean) =>
                updateNotificationPreferences({
                  emailMarketing: value,
                })
              }
              title="Send me occasional news and product updates via email"
              tooltip="Product emails"
              type="boolean"
              value={preferences.emailMarketing}
            />
          </Element>
        </SubContainer>
      ) : (
        <Text align="center" marginTop={6} size={3}>
          Loading email settings...
        </Text>
      )}
    </>
  );
};
