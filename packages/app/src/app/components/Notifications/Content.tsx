import { useAppState, useActions } from 'app/overmind';
import React, { useEffect } from 'react';
import { Element, Text, List, Stack } from '@codesandbox/components';
import { mapKeys, camelCase } from 'lodash-es';
import css from '@styled-system/css';
import history from 'app/utils/history';
import { Authorization, RecentNotificationFragment } from 'app/graphql/types';
import {
  sandboxUrl,
  teamSettingsUrl,
  v2BranchUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { Skeleton } from './Skeleton';
import {
  PullRequestReviewReceivedData,
  PullRequestReviewRequestData,
  TeamInviteData,
  TeamInviteRequestData,
  TeamAcceptedData,
  SandboxInvitationData,
} from './types';

import { Filters } from './Filters';
import { NotificationItem } from './NotificationItem';

const getNotificationComponent = (
  { id, type, data, read, insertedAt }: RecentNotificationFragment,
  openTeamAcceptModal: (params: {
    teamName: string;
    teamId: string;
    userAvatar: string;
  }) => void
) => {
  const parsedData = JSON.parse(data);
  const camelCaseData = mapKeys(parsedData, (v, k) => camelCase(k));

  if (type === 'pull_request_review_received') {
    const {
      reviewState,
      reviewerAvatar,
      reviewerName,
      owner,
      repo,
      branch,
      teamId,
      pullRequestNumber,
    } = camelCaseData as PullRequestReviewReceivedData;

    let reviewStateText: string;
    switch (reviewState) {
      case 'approved':
        reviewStateText = 'approved';
        break;
      case 'commented':
        reviewStateText = 'commented on';
        break;
      case 'changes_requested':
        reviewStateText = 'requested changes to';
        break;
      default:
        reviewStateText = 'left a review on';
        break;
    }

    return (
      <NotificationItem
        id={id}
        read={read}
        insertedAt={insertedAt}
        avatarUrl={reviewerAvatar}
        avatarName={reviewerName}
        onClick={() => {
          history.push(
            v2BranchUrl({
              owner,
              repoName: repo,
              branchName: branch,
              workspaceId: teamId,
            }) + '&mode=review'
          );
        }}
      >
        <Text weight="500">{reviewerName}</Text> {reviewStateText} your pull
        request #{pullRequestNumber} in <Text weight="500">{repo}</Text>.
      </NotificationItem>
    );
  }

  if (type === 'pull_request_review_requested') {
    const {
      requesterName,
      requesterAvatar,
      pullRequestNumber,
      owner,
      repo,
      branch,
      teamId,
    } = camelCaseData as PullRequestReviewRequestData;
    return (
      <NotificationItem
        id={id}
        read={read}
        insertedAt={insertedAt}
        avatarUrl={requesterAvatar}
        avatarName={requesterName}
        onClick={() => {
          history.push(
            v2BranchUrl({
              owner,
              repoName: repo,
              branchName: branch,
              workspaceId: teamId,
            }) + '&mode=review'
          );
        }}
      >
        <Text weight="500">{requesterName}</Text> requested your review on pull
        request #{pullRequestNumber} in <Text weight="500">{repo}</Text>.
      </NotificationItem>
    );
  }

  if (type === 'team_invite') {
    const {
      inviterName,
      inviterAvatar,
      teamName,
      teamId,
    } = camelCaseData as TeamInviteData;

    return (
      <NotificationItem
        id={id}
        read={read}
        insertedAt={insertedAt}
        avatarUrl={inviterAvatar}
        avatarName={inviterName}
        onClick={async () => {
          openTeamAcceptModal({
            teamName,
            teamId,
            userAvatar: inviterName,
          });
        }}
      >
        <Text weight="500">{inviterName}</Text> invites you to join their
        workspace <Text weight="500">{teamName}</Text>.
      </NotificationItem>
    );
  }

  if (type === 'team_invite_requested') {
    const {
      requesterAvatar,
      requesterName,
      requesterEmail,
      teamName,
    } = camelCaseData as TeamInviteRequestData;

    return (
      <NotificationItem
        id={id}
        read={read}
        insertedAt={insertedAt}
        avatarUrl={requesterAvatar}
        avatarName={requesterName}
        onClick={() => {
          history.push(teamSettingsUrl() + `?invite_email=${requesterEmail}`);
        }}
      >
        <Text weight="500">{requesterName}</Text> requested to join your
        workspace <Text weight="500">{teamName}</Text>.
      </NotificationItem>
    );
  }

  if (type === 'team_accepted') {
    const {
      userAvatar,
      userName,
      teamName,
    } = camelCaseData as TeamAcceptedData;

    return (
      <NotificationItem
        id={id}
        read={read}
        insertedAt={insertedAt}
        avatarUrl={userAvatar}
        avatarName={userName}
      >
        <Text weight="500">{userName}</Text> accepted your invitation to join{' '}
        <Text weight="500">{teamName}</Text>
      </NotificationItem>
    );
  }
  if (type === 'sandbox_invitation') {
    const {
      inviterAvatar,
      inviterName,
      sandboxTitle,
      sandboxAlias,
      sandboxId,
    } = camelCaseData as SandboxInvitationData;

    const authorization = parsedData.authorization.toUpperCase();
    const niceSandboxTitle = sandboxTitle || sandboxAlias || sandboxId;

    let nicePermissionName = 'view';
    if (authorization === Authorization.Comment) {
      nicePermissionName = 'comment on';
    } else if (authorization === Authorization.WriteCode) {
      nicePermissionName = 'edit';
    }

    return (
      <NotificationItem
        id={id}
        read={read}
        insertedAt={insertedAt}
        avatarUrl={inviterAvatar}
        avatarName={inviterName}
        onClick={() => {
          history.push(
            sandboxUrl({
              id: sandboxId,
              alias: sandboxAlias,
            })
          );
        }}
      >
        <Text weight="500">{inviterName}</Text> invites you to{' '}
        {nicePermissionName} <Text weight="500">{niceSandboxTitle}</Text>.
      </NotificationItem>
    );
  }

  return <div />;
};

export const NotificationsContent = props => {
  const { userNotifications } = useAppState();
  const {
    getNotifications,
    openTeamAcceptModal,
  } = useActions().userNotifications;

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  const getContent = () => {
    if (!userNotifications.notifications) {
      return <Skeleton />;
    }

    if (userNotifications.notifications.length === 0) {
      return (
        <Element padding={4}>
          {userNotifications.activeFilters.length ? (
            <Text size={3}>No notifications match your search</Text>
          ) : (
            <Text size={3}>You don{"'"}t have any notifications</Text>
          )}
        </Element>
      );
    }

    return userNotifications.notifications.map(notification =>
      getNotificationComponent(notification, openTeamAcceptModal)
    );
  };

  return (
    <Element
      css={{
        backgroundColor: '#333333',
        width: 321,
      }}
      {...props}
    >
      <Stack
        css={{ padding: '12px 16px' }}
        align="center"
        justify="space-between"
      >
        <Text color="#e5e5e5">Notifications</Text>

        {userNotifications.notifications ? <Filters /> : null}
      </Stack>
      <List css={css({ maxHeight: 400, overflow: 'auto' })}>
        {getContent()}
      </List>
    </Element>
  );
};
