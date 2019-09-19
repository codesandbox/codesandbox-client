import React from 'react';
import { observer, inject } from 'app/componentConnectors';
import Helmet from 'react-helmet';

import { Query } from 'react-apollo';

import getMostUsedTemplate from '../../../utils/get-most-used-template';

import { Content as Sandboxes } from '../../Sandboxes';

import CreateNewSandbox from '../../CreateNewSandbox';
import { RECENT_SANDBOXES_CONTENT_QUERY } from '../../../queries';

const RecentSandboxes = ({ store }) => (
  <>
    <Helmet>
      <title>Recent Sandboxes - CodeSandbox</title>
    </Helmet>
    <Query
      variables={{
        orderField: store.dashboard.orderBy.field,
        orderDirection: store.dashboard.orderBy.order.toUpperCase(),
      }}
      query={RECENT_SANDBOXES_CONTENT_QUERY}
    >
      {({ loading, error, data }) => {
        if (error) {
          return <div>Error!</div>;
        }

        const sandboxes = loading
          ? []
          : (data && data.me && data.me.sandboxes) || [];

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
        );
      }}
    </Query>
  </>
);

export default inject('signals', 'store')(observer(RecentSandboxes));
