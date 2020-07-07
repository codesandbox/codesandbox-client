import { Text, Element } from '@codesandbox/components';
import React, { FunctionComponent, useEffect } from 'react';
import { useOvermind } from 'app/overmind';

import { SubContainer, PaddedPreference } from '../elements';

export const MailPreferences: FunctionComponent = () => {
  const {
    actions: {
      userNotifications: {
        getNotificationPreferences,
        updateNotificationPreferences,
      },
    },
    state: { userNotifications },
  } = useOvermind();

  useEffect(() => {
    getNotificationPreferences();
  }, [getNotificationPreferences]);

  return (
    <>
      <Text block marginBottom={6} size={4} variant="muted" weight="bold">
        Email Settings
      </Text>

      {userNotifications.preferences ? (
        <SubContainer>
          <Element paddingTop={4}>
            <PaddedPreference
              setValue={(value: boolean) =>
                updateNotificationPreferences({
                  emailNewComment: value,
                })
              }
              title="Email me when my sandbox gets a new comment"
              tooltip="Email on new comment"
              type="boolean"
              value={userNotifications.preferences.emailNewComment}
            />
          </Element>
          <Element paddingTop={4}>
            <PaddedPreference
              setValue={(value: boolean) =>
                updateNotificationPreferences({
                  emailCommentReply: value,
                })
              }
              title="Email me when my comment gets a reply"
              tooltip="Email on new reply"
              type="boolean"
              value={userNotifications.preferences.emailCommentReply}
            />
          </Element>
          <Element paddingTop={4}>
            <PaddedPreference
              setValue={(value: boolean) =>
                updateNotificationPreferences({
                  emailCommentMention: value,
                })
              }
              title="Email me when I get mentioned in a comment"
              tooltip="Email on new mention"
              type="boolean"
              value={userNotifications.preferences.emailCommentMention}
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
