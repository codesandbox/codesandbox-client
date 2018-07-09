import React from 'react';
import { uniq } from 'lodash-es';
import { inject, observer, Observer } from 'mobx-react';
import { Query } from 'react-apollo';

import { basename } from 'path';

import Sandboxes from '../../Sandboxes';
import Navigation from './Navigation';
import CreateNewSandbox from '../../CreateNewSandbox';
import getMostUsedTemplate from '../utils/getMostUsedTemplate';

import { PATHED_SANDBOXES_CONTENT_QUERY } from '../../../queries';

const PathedSandboxes = props => {
  const path = '/' + (props.match.params.path || '');
  const teamId = props.match.params.teamId;

  document.title = `${basename(path) || 'Dashboard'} - CodeSandbox`;

  return (
    <Query query={PATHED_SANDBOXES_CONTENT_QUERY} variables={{ path, teamId }}>
      {({ loading, error, data }) => (
        <Observer>
          {() => {
            if (error) {
              console.error(error);
              return <div>Error!</div>;
            }

            const sandboxes =
              loading || !data.me.collection
                ? []
                : data.me.collection.sandboxes;

            const possibleTemplates = uniq(
              sandboxes.map(x => x.source.template)
            );

            const orderedSandboxes = props.store.dashboard.getFilteredSandboxes(
              sandboxes
            );

            let mostUsedTemplate = null;
            if (!loading) {
              try {
                mostUsedTemplate = getMostUsedTemplate(sandboxes);
              } catch (e) {
                // Not critical
              }
            }

            return (
              <Sandboxes
                ExtraElement={({ style }) => (
                  <CreateNewSandbox
                    collectionId={
                      data &&
                      data.me &&
                      data.me.collection &&
                      data.me.collection.id
                    }
                    mostUsedSandboxTemplate={mostUsedTemplate}
                    style={style}
                  />
                )}
                isLoading={loading}
                possibleTemplates={possibleTemplates}
                Header={<Navigation teamId={teamId} path={path} />}
                sandboxes={orderedSandboxes}
              />
            );
          }}
        </Observer>
      )}
    </Query>
  );
};

export default inject('store', 'signals')(observer(PathedSandboxes));
