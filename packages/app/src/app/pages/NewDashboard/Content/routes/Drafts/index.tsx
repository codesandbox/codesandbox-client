import React from 'react';
import { Element, Text } from '@codesandbox/components';
import { useQuery } from '@apollo/react-hooks';
import {
  PathedSandboxesQueryVariables,
  PathedSandboxesQuery,
} from 'app/graphql/types';
import { PATHED_SANDBOXES_CONTENT_QUERY } from 'app/pages/NewDashboard/queries';

import css from '@styled-system/css';
import { Filters } from 'app/pages/NewDashboard/Components/Filters';
import { useOvermind } from 'app/overmind';
import { getPossibleTemplates } from '../../utils';
import { SandboxCard } from '../../../Components/SandboxCard';

export const Drafts = () => {
  const { state } = useOvermind();
  const { loading, error, data } = useQuery<
    PathedSandboxesQuery,
    PathedSandboxesQueryVariables
  >(PATHED_SANDBOXES_CONTENT_QUERY, {
    variables: { path: '/', teamId: null },
  });

  if (error) {
    return <Text>Error</Text>;
  }

  if (loading) {
    return <Text>loading</Text>;
  }

  const sandboxes = data && data.me && data.me.collection.sandboxes;
  const possibleTemplates = getPossibleTemplates(sandboxes);
  const noTemplateSandboxes = sandboxes.filter(s => !s.customTemplate);
  const orderedSandboxes = state.dashboard.getFilteredSandboxes(
    // @ts-ignore
    noTemplateSandboxes
  );

  return (
    <Element>
      <Text marginBottom={4} block>
        Drafts
      </Text>
      <Filters possibleTemplates={possibleTemplates} />
      <Element
        css={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gridGap: 6,
        })}
      >
        {orderedSandboxes.map(sandbox => (
          <SandboxCard sandbox={sandbox} key={sandbox.id} />
        ))}
      </Element>
    </Element>
  );
};
