import React from 'react';
import { Mutation } from 'react-apollo';

import Tooltip from '@codesandbox/common/lib/components/Tooltip';
import history from 'app/utils/history';
import { dashboardUrl } from '@codesandbox/common/lib/utils/url-generator';
import { NotificationStatus } from '@codesandbox/notifications';
import { notificationState } from '@codesandbox/common/lib/utils/notifications';

import { REMOVE_FROM_TEAM, LEAVE_TEAM } from '../../../../queries';

import { StyledCrossIcon } from '../elements';

export default ({
  creatorId,
  currentUserId,
  userId,
  totalMemberSize,
  teamId,
  name,
}) => {
  if (creatorId === userId && totalMemberSize > 1) {
    return (
      <div
        style={{
          float: 'right',
          fontSize: '.875rem',
          fontWeight: 400,
          fontStyle: 'italic',
        }}
      >
        Owner
      </div>
    );
  }

  const isCreator = currentUserId === creatorId;
  const isOwnUser = userId === currentUserId;

  if (isCreator || isOwnUser) {
    return (
      <Tooltip
        content={
          isOwnUser ? 'Leave the team' : `Remove '${name}' from the team`
        }
        style={{
          fontSize: '1rem',
        }}
      >
        <Mutation
          variables={isOwnUser ? { teamId } : { teamId, userId }}
          mutation={isOwnUser ? LEAVE_TEAM : REMOVE_FROM_TEAM}
          refetchQueries={isOwnUser ? ['TeamsSidebar'] : []}
          onCompleted={() => {
            notificationState.addNotification({
              message: isOwnUser
                ? 'Succesfully left the team'
                : 'Succesfully removed from team',
              status: NotificationStatus.SUCCESS,
            });

            history.push(dashboardUrl());
          }}
        >
          {(mutate, { loading }) => (
            <StyledCrossIcon
              style={{
                opacity: loading ? 0.5 : 1,
                userSelect: loading ? 'none' : 'initial',
              }}
              onClick={() => {
                let confirmation = true;
                if (isOwnUser && isCreator) {
                  // eslint-disable-next-line no-alert
                  confirmation = confirm(
                    "Are you sure you want to leave? You won't be able to access the team again."
                  );
                }
                if (confirmation) {
                  mutate();
                }
              }}
            />
          )}
        </Mutation>
      </Tooltip>
    );
  }

  return false;
};
