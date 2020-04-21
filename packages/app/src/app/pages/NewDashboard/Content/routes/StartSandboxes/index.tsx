import React from 'react';
import css from '@styled-system/css';
import { Element, Text, Button } from '@codesandbox/components';
import { useQuery } from '@apollo/react-hooks';
import { useOvermind } from 'app/overmind';
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
    <Element>
      <Text marginBottom={4} block>
        Recently used Templates
      </Text>
      <Element
        css={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gridGap: 6,
        })}
        marginBottom={8}
      >
        {templates.map(({ sandbox }) => (
          <SandboxCard sandbox={sandbox} key={sandbox.id} />
        ))}
      </Element>

      <Text marginBottom={4} block>
        Your Recent Sandboxes
      </Text>
      <Element
        css={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gridGap: 6,
        })}
      >
        <Button onClick={() => modalOpened({ modal: 'newSandbox' })}>
          New Sandbox
        </Button>
        {sandboxes.map(sandbox => (
          <SandboxCard sandbox={sandbox} key={sandbox.id} />
        ))}
      </Element>
    </Element>
  );
};
