import React from 'react';
import { Mutation } from 'react-apollo';

import Input from 'common/components/Input';
import Button from 'app/components/Button';
import track from 'common/utils/analytics';
import history from 'app/utils/history';
import { teamOverviewUrl } from 'common/utils/url-generator';

import { Container, Description, HeaderContainer } from '../../elements';
import {
  Label,
  ComingSoon,
  Overlay,
  PatronInfo,
  QuestionHeader,
} from './elements';
import { CREATE_TEAM_MUTATION, TEAMS_QUERY } from '../../../queries';

import Plan from './Plan';

const FREE_POINTS = [
  'Unlimited Users',
  '20 Mb Static File Hosting per User',
  'Live Collaboration',
];

const PRO_POINTS = [
  'Unlimited Users',
  '500 Mb Static File Hosting per User',
  'Live Collaboration',
  'Team Invoices',
  'Private & Unlisted Sandboxes',
];

export default class CreateTeam extends React.PureComponent {
  state = { inputValue: '' };

  handleChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  render() {
    return (
      <Container style={{ width: 500 }}>
        <HeaderContainer>Create a Team</HeaderContainer>

        <Description>
          Make collaboration easy by creating teams. Teams allow you to create
          and edit sandboxes that are shared between you and your team members.
        </Description>

        <Mutation mutation={CREATE_TEAM_MUTATION}>
          {mutate => {
            const submit = e => {
              e.preventDefault();
              e.stopPropagation();
              const name = this.state.inputValue;

              track('Team - Create Team');

              mutate({
                variables: {
                  name,
                },
                optimisticResponse: {
                  __typename: 'Mutation',
                  createTeam: {
                    __typename: 'Team',
                    id: 'new-team',
                    name,
                  },
                },
                update: (proxy, { data: { createTeam } }) => {
                  // Read the data from our cache for this query.
                  const d = proxy.readQuery({
                    query: TEAMS_QUERY,
                  });

                  // Add our team from the mutation to the end.
                  d.me.teams.push(createTeam);
                  // Write our data back to the cache.
                  proxy.writeQuery({
                    query: TEAMS_QUERY,
                    data: d,
                  });
                },
              }).then(({ data }) => {
                if (window.showNotification) {
                  window.showNotification(
                    `Succesfully created team '${data.createTeam.name}'`,
                    'success'
                  );
                }

                history.push(teamOverviewUrl(data.createTeam.id));
              });
            };

            return (
              <form onSubmit={submit}>
                <Label htmlFor="team-name">Team Name</Label>
                <Input id="team-name" onChange={this.handleChange} block />

                <Label>Team Plan</Label>
                <Plan selected points={FREE_POINTS} name="Free" />

                <ComingSoon style={{ position: 'relative' }}>
                  <PatronInfo>
                    <QuestionHeader>
                      What if I{"'"}m a{' '}
                      <a target="_blank" href="/patron">
                        Patron
                      </a>?
                    </QuestionHeader>

                    <Description>
                      You can benefit from all Patron features. This means that
                      you can create unlimited private and unlisted sandboxes as
                      a Patron in your team.
                      <br />
                      <br />
                      When we release Team Pro it will be required to have a Pro
                      subscription to get the Patron functionality.
                    </Description>
                  </PatronInfo>

                  <Overlay className="overlay">
                    Coming Soon
                    <div style={{ fontSize: '1.125rem' }}>
                      <Button
                        href="https://airtable.com/shrlgLSJWiX8rYqyG"
                        target="_blank"
                        rel="noreferrer noopener"
                        small
                        style={{
                          position: 'absolute',
                          boxSizing: 'border-box',

                          bottom: '2rem',
                          left: '2rem',
                          right: '2rem',
                          width: 'calc(100% - 4rem)',
                        }}
                      >
                        Let me know when this releases
                      </Button>
                    </div>
                  </Overlay>
                  <Plan points={PRO_POINTS} name="Pro" />
                </ComingSoon>

                <Button
                  disabled={this.state.inputValue === ''}
                  style={{ float: 'right', marginBottom: '1rem' }}
                >
                  Create Team!
                </Button>
              </form>
            );
          }}
        </Mutation>
      </Container>
    );
  }
}
