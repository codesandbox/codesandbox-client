import React from 'react';
import { Observer } from 'app/componentConnectors';
import { Query } from 'react-apollo';
import Fuse from 'fuse.js';

import Sandboxes from '../../Sandboxes';

import { SEARCH_SANDBOXES_QUERY } from '../../../queries';
import { getPossibleTemplates } from '../../Sandboxes/utils';

let lastSandboxes = null;
let searchIndex = null;

const SearchSandboxes = () => (
  <Query query={SEARCH_SANDBOXES_QUERY}>
    {({ loading, error, data }) => (
      <Observer>
        {({ store }) => {
          if (error) {
            return <div>Error!</div>;
          }

          const search = store.dashboard.filters.search;
          let sandboxes = data && data.me && data.me.sandboxes;
          if (
            sandboxes &&
            (lastSandboxes === null || lastSandboxes !== sandboxes)
          ) {
            searchIndex = new Fuse(sandboxes, {
              threshold: 0.1,
              distance: 1000,
              keys: [
                { name: 'title', weight: 0.5 },
                { name: 'description', weight: 0.3 },
                { name: 'alias', weight: 0.2 },
                { name: 'source.template', weight: 0.1 },
                { name: 'id', weight: 0.1 },
              ],
            });

            lastSandboxes = sandboxes;
          }

          if (searchIndex && search) {
            sandboxes = searchIndex.search(search);
          }

          const Header =
            search && sandboxes
              ? `${sandboxes.length} search results for '${search}'`
              : 'Search results for all sandboxes';

          if (search) {
            document.title = `Search: '${search}' - CodeSandbox`;
          } else {
            document.title = `Search - CodeSandbox`;
          }

          let possibleTemplates = [];
          if (sandboxes) {
            possibleTemplates = getPossibleTemplates(sandboxes);

            sandboxes = store.dashboard
              .getFilteredSandboxes(sandboxes)
              .filter(x => !x.customTemplate);
          }

          return (
            <Sandboxes
              isLoading={loading}
              Header={Header}
              page="search"
              hideOrder={Boolean(search)}
              sandboxes={loading ? [] : sandboxes}
              possibleTemplates={possibleTemplates}
            />
          );
        }}
      </Observer>
    )}
  </Query>
);

export default SearchSandboxes;
