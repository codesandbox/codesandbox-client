import React, { useState } from 'react';
import css from '@styled-system/css';
import {
  Stack,
  Element,
  Text,
  ListAction,
  isMenuClicked,
} from '@codesandbox/components';
import { shortDistance } from '@codesandbox/common/lib/utils/short-distance';
import { v2BranchUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useActions } from 'app/overmind';
import { formatDistanceStrict } from 'date-fns';
import { useHistory } from 'react-router-dom';
import { zonedTimeToUtc } from 'date-fns-tz';
import { Menu } from './Menu';
import { InvitationIcon } from './Icons';

interface IPullRequestReviewReceivedProps {
  branch: string;
  id: string;
  insertedAt: string;
  owner: string;
  pullRequestNumber: number;
  read: boolean;
  repo: string;
  reviewerAvatar: string | null;
  reviewerName: string;
  reviewId: number;
  reviewState: string;
  teamId: string;
}

export const PullRequestReviewReceived = ({
  branch,
  id,
  insertedAt,
  owner,
  pullRequestNumber,
  read,
  repo,
  reviewerAvatar,
  reviewerName,
  reviewId,
  reviewState,
  teamId,
}: IPullRequestReviewReceivedProps) => {
  const { updateReadStatus } = useActions().userNotifications;
  const [hover, setHover] = useState(false);
  const history = useHistory();

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
    <ListAction
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={async event => {
        if (isMenuClicked(event)) return;
        if (!read) {
          await updateReadStatus(id);
        }
        history.push(
          v2BranchUrl({
            owner,
            repoName: repo,
            branchName: branch,
            workspaceId: teamId,
          }) + '&mode=review'
        );
      }}
      key={reviewId}
      css={css({ padding: 0 })}
    >
      <Element
        css={css({
          opacity: read ? 0.6 : 1,
          textDecoration: 'none',
          color: 'inherit',
        })}
      >
        <Stack align="center" gap={2} padding={4}>
          <Stack gap={4} align="flex-start">
            <Element css={css({ position: 'relative' })}>
              <Element
                as="img"
                src={reviewerAvatar}
                alt={reviewerName}
                css={css({
                  width: 32,
                  height: 32,
                  display: 'block',
                  borderRadius: 'small',
                })}
              />
              <InvitationIcon
                read={read}
                css={css({
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                })}
              />
            </Element>
            <Text size={3} variant="muted">
              {reviewerName}{' '}
              <Text css={css({ color: 'sideBar.foreground' })}>
                {reviewStateText}{' '}
              </Text>{' '}
              your pull request #{pullRequestNumber} in {owner}/{repo}.
            </Text>
          </Stack>
          <Stack
            css={css({ width: 70, flexShrink: 0, justifyContent: 'flex-end' })}
          >
            {hover ? (
              <Menu read={read} id={id} />
            ) : (
              <Text
                size={2}
                align="right"
                block
                css={css({ color: 'sideBar.foreground' })}
              >
                {shortDistance(
                  formatDistanceStrict(
                    zonedTimeToUtc(insertedAt, 'Etc/UTC'),
                    new Date()
                  )
                )}
              </Text>
            )}
          </Stack>
        </Stack>
      </Element>
    </ListAction>
  );
};
