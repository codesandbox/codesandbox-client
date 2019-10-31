import React, { useEffect, useState } from 'react';
import { sortBy } from 'lodash-es';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { DelayedAnimation } from 'app/components/DelayedAnimation';
import { Button } from '@codesandbox/common/lib/components/Button';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import history from 'app/utils/history';
import track from '@codesandbox/common/lib/utils/analytics';
import { ContextMenu } from 'app/components/ContextMenu';
import CustomTemplate from '@codesandbox/common/lib/components/CustomTemplate';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { LIST_BOOKMARKED_TEMPLATES } from 'app/components/CreateNewSandbox/queries';
// @ts-ignore
import {
  UnbookmarkTemplateFromDashboardMutation,
  UnbookmarkTemplateFromDashboardMutationVariables,
  ListFollowedTemplatesQuery,
} from 'app/graphql/types';
import { unbookmarkTemplateFromDashboard } from './mutations.gql';
import { ButtonContainer } from './elements';

import { Container, Grid, EmptyTitle } from '../elements';
import { Navigation } from '../Navigation';

export const FollowedTemplates = props => {
  const { teamId } = props.match.params;
  const [sortedTemplates, setSortedTemplates] = useState<
    ListFollowedTemplatesQuery['me']['bookmarkedTemplates']
  >();

  const { loading, error, data } = useQuery<ListFollowedTemplatesQuery>(
    LIST_BOOKMARKED_TEMPLATES
  );
  const client = useApolloClient();
  const [unBookmark] = useMutation<
    UnbookmarkTemplateFromDashboardMutation,
    UnbookmarkTemplateFromDashboardMutationVariables
  >(unbookmarkTemplateFromDashboard, {
    onCompleted({ unbookmarkTemplate: unbookmarkMutation }) {
      const newTemplates = data.me.bookmarkedTemplates.filter(
        template => template.id !== unbookmarkMutation.id
      );
      client.writeData({
        data: {
          ...data,
          me: {
            ...data.me,
            bookmarkedTemplates: newTemplates,
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
        setSortedTemplates(team.bookmarkedTemplates);
      } else {
        setSortedTemplates(data.me.bookmarkedTemplates);
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
      <Navigation bookmarked teamId={teamId} number={orderedTemplates.length} />
      {!orderedTemplates.length && (
        <div>
          <EmptyTitle>
            <p style={{ marginBottom: '0.5rem' }}>
              You don{"'"}t have any bookmarked templates yet. You can discover
              new templates on Template Universe!
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
                title: 'Unbookmark Template',
                action: () => {
                  track('Template - Unbookmarked', { source: 'Context Menu' });
                  if (teamId) {
                    unBookmark({
                      variables: { teamId, template: template.id },
                    });
                  } else {
                    unBookmark({
                      variables: {
                        template: template.id,
                        teamId: undefined,
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
