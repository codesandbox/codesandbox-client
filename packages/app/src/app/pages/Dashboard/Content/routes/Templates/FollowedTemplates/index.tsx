import React, { useEffect, useState } from 'react';
import { sortBy } from 'lodash-es';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import DelayedAnimation from 'app/components/DelayedAnimation';
import { Button } from '@codesandbox/common/lib/components/Button';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import history from 'app/utils/history';
import track from '@codesandbox/common/lib/utils/analytics';
import ContextMenu from 'app/components/ContextMenu';
import CustomTemplate from '@codesandbox/common/lib/components/CustomTemplate';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
// @ts-ignore
import { unfollowTemplate } from 'app/src/app/pages/Sandbox/Editor/Workspace/items/NotOwnedSandboxInfo/mutations.gql';

import { LIST_FOLLOWED_TEMPLATES } from '../../../../queries';
import { ButtonContainer } from './elements';

import { Container, Grid, EmptyTitle } from '../elements';
import { Navigation } from '../Navigation';

export const FollowedTemplates = props => {
  const teamId = props.match.params.teamId;
  const [sortedTemplates, setSortedTemplates] = useState();

  const { loading, error, data } = useQuery(LIST_FOLLOWED_TEMPLATES);
  const client = useApolloClient();
  const [unfollow] = useMutation<any, any>(unfollowTemplate, {
    onCompleted({ unfollowTemplate: unfollowMutation }) {
      const newTemplates = data.me.followedTemplates.filter(
        template => template.id !== unfollowMutation.id
      );
      client.writeData({
        data: {
          ...data,
          me: {
            ...data.me,
            followedTemplates: newTemplates,
          },
        },
      });
    },
  });

  useEffect(() => {
    document.title = `${
      teamId ? 'Team' : 'My'
    } Followed Templates - CodeSandbox`;
  }, [teamId]);

  useEffect(() => {
    if (data && data.me) {
      if (teamId) {
        const team = data.me.teams.find(t => t.id === teamId);
        setSortedTemplates(team.followedTemplates);
      } else {
        setSortedTemplates(data.me.followedTemplates);
      }
    }
  }, [teamId, data]);

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  if (loading || !sortedTemplates) {
    return (
      <DelayedAnimation
        delay={0.6}
        style={{
          textAlign: 'center',
          marginTop: '2rem',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        Fetching Sandboxes...
      </DelayedAnimation>
    );
  }
  const orderedTemplates = sortBy(sortedTemplates, template =>
    getSandboxName(template.sandbox).toLowerCase()
  );

  return (
    <Container>
      <Navigation following teamId={teamId} number={orderedTemplates.length} />
      {!orderedTemplates.length && (
        <div>
          <EmptyTitle>
            <p style={{ marginBottom: '0.5rem' }}>
              You are not following any templates yet. You can discover new
              templates on the discover page!
            </p>
            <ButtonContainer>
              <Button small href="/docs/templates" secondary>
                Learn more
              </Button>
              <Button small href="/explore">
                Explore
              </Button>
            </ButtonContainer>
          </EmptyTitle>
        </div>
      )}
      <Grid>
        {orderedTemplates.map((template, i) => (
          <ContextMenu
            items={[
              {
                title: 'Unfollow Template',
                action: () => {
                  track('Template - Unfollowed', { source: 'Context Menu' });
                  if (teamId) {
                    unfollow({
                      variables: { team: teamId, template: template.id },
                    });
                  } else {
                    unfollow({
                      variables: {
                        template: template.id,
                      },
                    });
                  }
                  return true;
                },
              },
            ]}
            key={template.id}
          >
            <CustomTemplate
              i={i}
              template={template}
              onClick={() => history.push(sandboxUrl(template.sandbox))}
            />
          </ContextMenu>
        ))}
      </Grid>
    </Container>
  );
};
