import React from 'react';
import { Element, Text } from '@codesandbox/components';
import { useQuery } from '@apollo/react-hooks';

import isSameWeek from 'date-fns/isSameWeek';
import {
  DeletedSandboxesQueryVariables,
  DeletedSandboxesQuery,
} from 'app/graphql/types';
import { SandboxCard } from '../../../Components/SandboxCard';
import { DELETED_SANDBOXES_CONTENT_QUERY } from '../../../queries';

export const Deleted = () => {
  const { data, error, loading } = useQuery<
    DeletedSandboxesQuery,
    DeletedSandboxesQueryVariables
  >(DELETED_SANDBOXES_CONTENT_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  if (error) {
    return <Text>Error</Text>;
  }

  if (loading) {
    return <Text>loading</Text>;
  }

  const sandboxes = data && data.me && data.me.sandboxes;
  const orderedSandboxes = sandboxes.reduce(
    (accumulator, currentValue) => {
      if (isSameWeek(new Date(currentValue.removedAt), new Date())) {
        accumulator.week.push(currentValue);

        return accumulator;
      }

      accumulator.older.push(currentValue);

      return accumulator;
    },
    {
      week: [],
      older: [],
    }
  );

  return (
    <Element>
      <Text marginBottom={2} block>
        Recently Deleted
      </Text>
      <Text variant="muted" block marginBottom={11}>
        Sandboxes, Templates and Folders are permanently deleted after 30 days{' '}
      </Text>
      {orderedSandboxes.week.length && (
        <Element marginBottom={14}>
          <Text marginBottom={6} block>
            Archived this week
          </Text>
          {orderedSandboxes.week.map(sandbox => (
            <SandboxCard sandbox={sandbox} key={sandbox.id} />
          ))}
        </Element>
      )}
      {orderedSandboxes.older.length && (
        <>
          <Text marginBottom={6} block>
            Archived Earlier
          </Text>
          {orderedSandboxes.older.map(sandbox => (
            <SandboxCard sandbox={sandbox} key={sandbox.id} />
          ))}
        </>
      )}
    </Element>
  );
};
