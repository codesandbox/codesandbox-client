import React from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@apollo/react-hooks';

import { useOvermind } from 'app/overmind';
import CreateNewSandbox from 'app/components/CreateNewSandbox';
import getMostUsedTemplate from '../../../utils/get-most-used-template';
import { Content as Sandboxes } from '../../Sandboxes';
import { RECENT_SANDBOXES_CONTENT_QUERY } from '../../../queries';

export const RecentSandboxes = () => {
  const { state } = useOvermind();
  const { loading, error, data } = useQuery(RECENT_SANDBOXES_CONTENT_QUERY, {
    variables: {
      orderField: state.dashboard.orderBy.field,
      orderDirection: state.dashboard.orderBy.order.toUpperCase(),
    },
  });

  if (error) {
    return <div>Error!</div>;
  }

  const sandboxes = loading ? [] : (data && data.me && data.me.sandboxes) || [];

  let mostUsedTemplate = null;
  try {
    mostUsedTemplate = getMostUsedTemplate(sandboxes);
  } catch (e) {
    // Not critical
  }

  // We want to hide all templates
  // TODO: make this a query variable for graphql and move the logic to the server
  const noTemplateSandboxes = sandboxes.filter(s => !s.customTemplate);
  return (
    <>
      <Helmet>
        <title>Recent Sandboxes - CodeSandbox</title>
      </Helmet>
      <Sandboxes
        isLoading={loading}
        Header="Recent Sandboxes"
        ExtraElement={({ style }) => (
          <CreateNewSandbox
            mostUsedSandboxTemplate={mostUsedTemplate}
            style={style}
          />
        )}
        hideFilters
        sandboxes={noTemplateSandboxes}
        page="recent"
      />
    </>
  );
};
