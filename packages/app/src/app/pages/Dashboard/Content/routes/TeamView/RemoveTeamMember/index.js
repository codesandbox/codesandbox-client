import React from 'react';
import { Mutation } from 'react-apollo';

import Tooltip from 'common/components/Tooltip';
import history from 'app/utils/history';
import { dashboardUrl } from 'common/utils/url-generator';

import { REMOVE_FROM_TEAM, LEAVE_TEAM } from '../../../../queries';

import { StyledCrossIcon, Owner } from '../elements';

export default ({
  creatorId,
  currentUserId,
  userId,
  totalMemberSize,
  teamId,
  name,
}) => {
  if (creatorId === userId && totalMemberSize > 1) {
    return <Owner>Owner</Owner>;
  }

  const isCreator = currentUserId === creatorId;
  const isOwnUser = userId === currentUserId;

  if (isCreator || isOwnUser) {
    return (
      <Tooltip
        title={isOwnUser ? 'Leave the team' : `Remove '${name}' from the team`}
        css={`
          font-size: 1rem;
        `}
      >
        <Mutation
          variables={isOwnUser ? { teamId } : { teamId, userId }}
          mutation={isOwnUser ? LEAVE_TEAM : REMOVE_FROM_TEAM}
          refetchQueries={isOwnUser ? ['TeamsSidebar'] : []}
          onCompleted={() => {
            if (window.showNotification) {
              window.showNotification(
                isOwnUser
                  ? 'Succesfully left the team'
                  : 'Succesfully removed from team',
                'success'
              );
            }
            history.push(dashboardUrl());
          }}
        >
          {(mutate, { loading }) => (
            <StyledCrossIcon
              css={`
                opacity: ${loading ? 0.5 : 1};
                user-select: ${loading ? 'none' : 'initial'};
              `}
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
