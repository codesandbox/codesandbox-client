import React from 'react';
import gql from 'graphql-tag';
import { sortBy } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Query } from 'react-apollo';

import { basename } from 'path';

import Sandboxes from '../Sandboxes';
import Navigation from './Navigation';

import { PATHED_SANDBOXES_CONTENT_QUERY } from '../../queries';

const PathedSandboxes = props => {
  const path = '/' + (props.match.params.path || '');

  // Trigger mobx
  const orderField = props.store.dashboard.orderBy.field;

  document.title = `CodeSandbox - ${basename(path) || 'Dashboard'}`;

  return (
    <Query query={PATHED_SANDBOXES_CONTENT_QUERY} variables={{ path }}>
      {({ loading, error, data }) => {
        if (error) {
          return <div>Error!</div>;
        }

        const sandboxes =
          loading || !data.me.collection ? [] : data.me.collection.sandboxes;

        const isDateField =
          orderField === 'inserted_at' || orderField === 'updated_at';
        const orderedSandboxes = sortBy(sandboxes, s => {
          if (isDateField) {
            return +new Date(s[orderField]);
          }

          return s[orderField];
        });

        return (
          <Sandboxes
            isLoading={loading}
            Header={<Navigation path={path} />}
            sandboxes={orderedSandboxes}
          />
        );
      }}
    </Query>
  );
};

export default inject('store', 'signals')(observer(PathedSandboxes));
