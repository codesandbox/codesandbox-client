import React from 'react';
import css from '@styled-system/css';
import { Element, Text } from '@codesandbox/components';
import { useQuery } from '@apollo/react-hooks';
import {
  ListTemplatesQuery,
  ListTemplatesQueryVariables,
} from 'app/graphql/types';
import { LIST_OWNED_TEMPLATES } from 'app/components/CreateNewSandbox/queries';
import { SandboxCard } from '../../../Components/SandboxCard';

export const Templates = () => {
  const { loading, error, data } = useQuery<
    ListTemplatesQuery,
    ListTemplatesQueryVariables
  >(LIST_OWNED_TEMPLATES, {
    variables: { showAll: false },
  });

  if (error) {
    return <Text>Error</Text>;
  }

  if (loading) {
    return <Text>loading</Text>;
  }

  const templates = data && data.me && data.me.templates;

  return (
    <Element>
      <Text marginBottom={4} block>
        Templates
      </Text>
      <Element
        css={css({
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gridGap: 6,
        })}
      >
        {templates.map(({ sandbox }) => (
          <SandboxCard sandbox={sandbox} key={sandbox.id} />
        ))}
      </Element>
    </Element>
  );
};
