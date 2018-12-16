import React from 'react';
import { inject } from 'mobx-react';
import styled from 'styled-components';

import { Mutation } from 'react-apollo';

import Input from 'common/components/Input';
import Button from 'app/components/Button';
import track from 'common/utils/analytics';

import { INVITE_TO_TEAM } from '../../../../queries';

const ErrorMessage = styled.div`
  color: ${props => props.theme.red};
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const Form = styled.form`
  display: flex;
`;

const AddTeamMember = ({ teamId, signals }) => (
  <Mutation mutation={INVITE_TO_TEAM}>
    {(mutate, { loading, error }) => {
      let input = null;

      const submit = e => {
        e.preventDefault();
        e.stopPropagation();

        let isEmail = input.value.indexOf('@') > -1;

        track('Team - Add Member', { email: isEmail });

        isEmail = false;

        // We don't enable email for now for privacy reasons

        const variables = { teamId };

        const value = input.value;
        if (isEmail) {
          variables.email = value;
        } else {
          variables.username = value;
        }

        mutate({
          variables,
        }).then(() => {
          signals.notificationAdded({
            message: `${value} has been invited!`,
            type: 'success',
          });
        });

        input.value = '';
      };

      const errorMessage =
        error && error.graphQLErrors && error.graphQLErrors[0].message;

      return (
        <React.Fragment>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Form onSubmit={loading ? undefined : submit}>
            <Input
              ref={node => {
                input = node;
              }}
              placeholder="Add member by username"
              block
            />
            <Button
              disabled={loading}
              css={`
                width: 200px;
              `}
              small
            >
              {loading ? 'Adding Member...' : 'Add Member'}
            </Button>
          </Form>
        </React.Fragment>
      );
    }}
  </Mutation>
);

export default inject('signals')(AddTeamMember);
