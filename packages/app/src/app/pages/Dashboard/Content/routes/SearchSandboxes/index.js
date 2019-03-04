import React from 'react';
import { inject, Observer } from 'mobx-react';
import { uniq } from 'lodash-es';
import { Query } from 'react-apollo';
import Fuse from 'fuse.js';

import Sandboxes from '../../Sandboxes';

import { SEARCH_SANDBOXES_QUERY } from '../../../queries';

let lastSandboxes = null;
let searchIndex = null;

const SearchSandboxes = ({ store }) => (
  <Query query={SEARCH_SANDBOXES_QUERY}>
    {({ loading, error, data }) => (
      <Observer>
        {() => {
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
              keys: [
                { name: 'title', weight: 0.5 },
                { name: 'description', weight: 0.3 },
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
            possibleTemplates = uniq(sandboxes.map(x => x.source.template));

            sandboxes = store.dashboard.getFilteredSandboxes(sandboxes);
          }

          return (
            <Sandboxes
              isLoading={loading}
              Header={Header}
              page="search"
              hideOrder={!!search}
              sandboxes={loading ? [] : sandboxes}
              possibleTemplates={possibleTemplates}
            />
          );
        }}
      </Observer>
    )}
  </Query>
);

export default inject('signals', 'store')(SearchSandboxes);
