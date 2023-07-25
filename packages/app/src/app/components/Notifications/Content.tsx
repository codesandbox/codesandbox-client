import { useAppState, useActions } from 'app/overmind';
import React, { useEffect } from 'react';
import { Element, Text, List } from '@codesandbox/components';
import { mapKeys, camelCase } from 'lodash-es';
import css from '@styled-system/css';
import { Skeleton } from './Skeleton';
import {
  CommentData,
  MentionData,
  PullRequestReviewReceivedData,
  PullRequestReviewRequestData,
  TeamInviteData,
  TeamInviteRequestData,
  TeamAcceptedData,
  SandboxInvitationData,
} from './types';

import { PullRequestReviewReceived } from './notifications/PullRequestReviewReceived';
import { PullRequestReviewRequest } from './notifications/PullRequestReviewRequest';
import { SandboxInvitation } from './notifications/SandboxInvitation';
import { TeamInviteRequest } from './notifications/TeamInviteRequest';
import { TeamAccepted } from './notifications/TeamAccepted';
import { TeamInvite } from './notifications/TeamInvite';
import { Mention } from './notifications/Mention';
import { Comment } from './notifications/Comment';
import { Filters } from './Filters';

const getNotificationComponent = ({ id, type, data, read, insertedAt }) => {
  const parsedData = JSON.parse(data);
  const camelCaseData = mapKeys(parsedData, (v, k) => camelCase(k));

  if (type === 'mention') {
    return (
      <Mention
        insertedAt={insertedAt}
        id={id}
        read={read}
        {...(camelCaseData as MentionData)}
      />
    );
  }

  if (type === 'comment') {
    return (
      <Comment
        insertedAt={insertedAt}
        id={id}
        read={read}
        {...(camelCaseData as CommentData)}
      />
    );
  }

  if (type === 'pull_request_review_received') {
    return (
      <PullRequestReviewReceived
        insertedAt={insertedAt}
        id={id}
        read={read}
        {...(camelCaseData as PullRequestReviewReceivedData)}
      />
    );
  }

  if (type === 'pull_request_review_requested') {
    return (
      <PullRequestReviewRequest
        insertedAt={insertedAt}
        id={id}
        read={read}
        {...(camelCaseData as PullRequestReviewRequestData)}
      />
    );
  }

  if (type === 'team_invite') {
    return (
      <TeamInvite
        insertedAt={insertedAt}
        id={id}
        read={read}
        {...(camelCaseData as TeamInviteData)}
      />
    );
  }

  if (type === 'team_invite_requested') {
    return (
      <TeamInviteRequest
        insertedAt={insertedAt}
        id={id}
        read={read}
        {...(camelCaseData as TeamInviteRequestData)}
      />
    );
  }

  if (type === 'team_accepted') {
    return (
      <TeamAccepted
        insertedAt={insertedAt}
        id={id}
        read={read}
        {...(camelCaseData as TeamAcceptedData)}
      />
    );
  }
  if (type === 'sandbox_invitation') {
    return (
      <SandboxInvitation
        insertedAt={insertedAt}
        id={id}
        read={read}
        {...(camelCaseData as SandboxInvitationData)}
        authorization={parsedData.authorization.toUpperCase()}
      />
    );
  }

  return <div />;
};

export const NotificationsContent = props => {
  const { userNotifications } = useAppState();
  const { getNotifications } = useActions().userNotifications;

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const getContent = () => {
    if (!userNotifications.notifications) {
      return <Skeleton />;
    }

    if (userNotifications.notifications.length === 0) {
      return (
        <Element padding={6}>
          {userNotifications.activeFilters.length ? (
            <Text align="center">No notifications match your search</Text>
          ) : (
            <Text align="center">You don{"'"}t have any notifications</Text>
          )}
        </Element>
      );
    }

    return userNotifications.notifications.map(notification =>
      getNotificationComponent(notification)
    );
  };

  return (
    <Element
      css={css({
        backgroundColor: 'menuList.background',
        fontFamily: 'Inter',
        width: 321,
      })}
      {...props}
    >
      <Element
        padding={4}
        css={css({
          display: 'grid',
          gridTemplateColumns: '1fr 60px',
        })}
      >
        <Text weight="regular" size={4}>
          Notifications
        </Text>
        <Element>
          {userNotifications.notifications ? <Filters /> : null}
        </Element>
      </Element>
      <List css={css({ maxHeight: 400, overflow: 'auto' })}>
        {getContent()}
      </List>
    </Element>
  );
};
