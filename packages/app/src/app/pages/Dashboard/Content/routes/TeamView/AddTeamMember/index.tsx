import React from 'react';
import styled from 'styled-components';

import { Button } from '@codesandbox/components';

import { useMutation } from '@apollo/react-hooks';

import track from '@codesandbox/common/lib/utils/analytics';

import { UserSearchInput } from 'app/components/UserSearchInput';

import { useOvermind } from 'app/overmind';
import { INVITE_TO_TEAM, INVITE_TO_TEAM_VIA_EMAIL } from '../../../../queries';
import { IAddTeamMemberProps, IMutationVariables } from './types';

const ErrorMessage = styled.div`
  color: ${props => props.theme.red};
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

export const AddTeamMember: React.FC<IAddTeamMemberProps> = ({ teamId }) => {
  const { actions } = useOvermind();
  const [inviteToTeam] = useMutation(INVITE_TO_TEAM);
  const [inviteToTeamViaEmail] = useMutation(INVITE_TO_TEAM_VIA_EMAIL);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<
    null | (Error & { graphQLErrors: Error[] })
  >(null);
  const [inviteValue, setInviteValue] = React.useState('');

  const submit: React.FormEventHandler = async e => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    setError(null);

    try {
      const isEmail = inviteValue.includes('@');

      track('Team - Add Member', { email: isEmail });

      // We don't enable email for now for privacy reasons

      const variables: IMutationVariables = { teamId };

      const inviteVar = inviteValue;
      setInviteValue('');

      if (isEmail) {
        variables.email = inviteVar;
        await inviteToTeamViaEmail({
          variables,
        });
      } else {
        variables.username = inviteVar;
        await inviteToTeam({
          variables,
        });
      }

      actions.notificationAdded({
        title: `${inviteVar} has been invited!`,
        notificationType: 'success',
      });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const errorMessage =
    error &&
    error.graphQLErrors &&
    error.graphQLErrors[0] &&
    error.graphQLErrors[0].message;

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
        <Button
          type="submit"
          loading={loading}
          style={{ width: 200, marginLeft: 8 }}
        >
          {loading ? 'Adding Member...' : 'Add Member'}
        </Button>
      </form>
    </>
  );
};
