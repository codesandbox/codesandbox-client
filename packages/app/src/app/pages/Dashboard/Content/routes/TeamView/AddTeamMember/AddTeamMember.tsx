import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import Input from '@codesandbox/common/lib/components/Input';
import track from '@codesandbox/common/lib/utils/analytics';
import { useOvermind } from 'app/overmind';
import { INVITE_TO_TEAM } from '../../../../queries';
import { IAddTeamMemberProps, IMutationVariables } from './types';
import { ErrorMessage, AddUserForm, AddButton } from './elements';

export const AddTeamMember: React.FC<IAddTeamMemberProps> = ({ teamId }) => {
  const { actions } = useOvermind();
  const [inviteToTeam, { loading, error }] = useMutation(INVITE_TO_TEAM);
  let input: HTMLInputElement = null;

  const submit: React.FormEventHandler = e => {
    e.preventDefault();
    e.stopPropagation();

    let isEmail = input.value.includes('@');

    track('Team - Add Member', { email: isEmail });

    isEmail = false;

    // We don't enable email for now for privacy reasons

    const variables: IMutationVariables = { teamId };

    const { value } = input;
    if (isEmail) {
      variables.email = value;
    } else {
      variables.username = value;
    }

    inviteToTeam({
      variables,
    }).then(() => {
      actions.notificationAdded({
        title: `${value} has been invited!`,
        notificationType: 'success',
      });
    });

    input.value = '';
  };

  const errorMessage =
    error && error.graphQLErrors && error.graphQLErrors[0].message;

  return (
    <>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <AddUserForm onSubmit={loading ? undefined : submit}>
        <Input
          ref={node => {
            input = node;
          }}
          placeholder="Add member by username"
          block
        />
        <AddButton disabled={loading}>
          {loading ? 'Adding Member...' : 'Add Member'}
        </AddButton>
      </AddUserForm>
    </>
  );
};
