import React from 'react';
import styled from 'styled-components';

import { useMutation } from '@apollo/react-hooks';

import Input from '@codesandbox/common/lib/components/Input';
import { Button } from '@codesandbox/common/lib/components/Button';
import track from '@codesandbox/common/lib/utils/analytics';

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
  const [mutate, { loading, error }] = useMutation(INVITE_TO_TEAM);
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

    mutate({
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
      <form style={{ display: 'flex' }} onSubmit={loading ? undefined : submit}>
        <Input
          ref={node => {
            input = node;
          }}
          placeholder="Add member by username"
          block
        />
        <Button disabled={loading} style={{ width: 200 }} small>
          {loading ? 'Adding Member...' : 'Add Member'}
        </Button>
      </form>
    </>
  );
};
