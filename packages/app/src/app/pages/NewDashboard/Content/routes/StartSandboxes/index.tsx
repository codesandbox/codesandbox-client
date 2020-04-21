import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { useOvermind } from 'app/overmind';
import { Text, Button, Grid, Column } from '@codesandbox/components';
import css from '@styled-system/css';

import {
  RecentSandboxesQuery,
  RecentSandboxesQueryVariables,
  ListPersonalTemplatesQuery,
  ListPersonalTemplatesQueryVariables,
} from 'app/graphql/types';
import { LIST_PERSONAL_TEMPLATES } from 'app/components/CreateNewSandbox/queries';
import { RECENT_SANDBOXES_CONTENT_QUERY } from '../../../queries';
import { SandboxCard } from '../../../Components/SandboxCard';

export const StartSandboxes = () => {
  const {
    state,
    actions: { modalOpened },
  } = useOvermind();
  const { loading, error, data } = useQuery<
    RecentSandboxesQuery,
    RecentSandboxesQueryVariables
  >(RECENT_SANDBOXES_CONTENT_QUERY, {
    variables: {
      orderField: state.dashboard.orderBy.field,
      // @ts-ignore
      orderDirection: state.dashboard.orderBy.order.toUpperCase(),
    },
  });

  const {
    data: templatesData,
    error: templatesError,
    loading: templatesLoading,
  } = useQuery<ListPersonalTemplatesQuery, ListPersonalTemplatesQueryVariables>(
    LIST_PERSONAL_TEMPLATES,
    {
      variables: {},
      fetchPolicy: 'cache-and-network',
    }
  );

  if (error || templatesError) {
    return <Text>Error</Text>;
  }

  if (loading || templatesLoading) {
    return <Text>loading</Text>;
  }

  const sandboxes = data && data.me && data.me.sandboxes;
  const templates =
    templatesData &&
    templatesData.me &&
    templatesData.me.recentlyUsedTemplates.slice(0, 4);

  return (
    <>
      <section>
        <Text marginBottom={4} block>
          Recently used Templates
        </Text>
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          })}
        >
          {templates.map(({ sandbox }) => (
            <Column key={sandbox.id}>
              <SandboxCard sandbox={sandbox} />
            </Column>
          ))}
        </Grid>
      </section>

      <section>
        <Text marginBottom={4} block>
          Your Recent Sandboxes
        </Text>
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          })}
        >
          <Column>
            <Button
              onClick={() => modalOpened({ modal: 'newSandbox' })}
              css={css({
                height: 240,
                border: '1px solid',
                borderColor: 'grays.600',
                borderRadius: 'medium',
              })}
            >
              New Sandbox
            </Button>
          </Column>
          {sandboxes.map(sandbox => (
            <Column key={sandbox.id}>
              <SandboxCard sandbox={sandbox} />
            </Column>
          ))}
        </Grid>
      </section>
    </>
  );
};
