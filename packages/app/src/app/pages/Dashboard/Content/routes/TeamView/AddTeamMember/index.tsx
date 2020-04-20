import React from 'react';
import styled from 'styled-components';

import { Button } from '@codesandbox/components';

import { useMutation } from '@apollo/react-hooks';

import track from '@codesandbox/common/lib/utils/analytics';

import { UserSearchInput } from 'app/components/UserSearchInput';

import { useOvermind } from 'app/overmind';
import { INVITE_TO_TEAM } from '../../../../queries';
import { IAddTeamMemberProps, IMutationVariables } from './types';

const ErrorMessage = styled.div`
  color: ${props => props.theme.red};
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const AddTeamMember: React.FC<IAddTeamMemberProps> = ({ teamId }) => {
  const { actions } = useOvermind();
  const [inviteToTeam, { loading, error }] = useMutation(INVITE_TO_TEAM);
  const [inviteValue, setInviteValue] = React.useState('');

  const submit: React.FormEventHandler = e => {
    e.preventDefault();
    e.stopPropagation();

    let isEmail = inviteValue.includes('@');

    track('Team - Add Member', { email: isEmail });

    isEmail = false;

    // We don't enable email for now for privacy reasons

    const variables: IMutationVariables = { teamId };

    if (isEmail) {
      variables.email = inviteValue;
    } else {
      variables.username = inviteValue;
    }

    inviteToTeam({
      variables,
    }).then(() => {
      actions.notificationAdded({
        title: `${inviteValue} has been invited!`,
        notificationType: 'success',
      });
    });

    setInviteValue('');
  };

  const errorMessage =
    error && error.graphQLErrors && error.graphQLErrors[0].message;

  return (
    <>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <form style={{ display: 'flex' }} onSubmit={loading ? undefined : submit}>
        <UserSearchInput
          inputValue={inviteValue}
          onInputValueChange={val => {
            setInviteValue(val);
          }}
        />
        <Button type="submit" loading={loading} style={{ width: 200 }}>
          {loading ? 'Adding Member...' : 'Add Member'}
        </Button>
      </form>
    </>
  );
};
