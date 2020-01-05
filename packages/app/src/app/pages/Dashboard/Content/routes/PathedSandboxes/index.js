import { basename } from 'path';

import { CreateNewSandboxButton } from 'app/components/CreateNewSandbox';
import { Observer } from 'app/overmind';
import React from 'react';
import { Query } from 'react-apollo';
import Helmet from 'react-helmet';

import { PATHED_SANDBOXES_CONTENT_QUERY } from '../../../queries';
// import Folders from './Folders';
import getMostUsedTemplate from '../../../utils/get-most-used-template';
import { Content as Sandboxes } from '../../Sandboxes';
import { getPossibleTemplates } from '../../Sandboxes/utils';
import { Navigation } from './Navigation';

const PathedSandboxes = props => {
  const path = '/' + decodeURIComponent(props.match.params.path || '');
  const { teamId } = props.match.params;
  return (
    <>
      <Helmet>
        <title>{basename(path) || 'Dashboard'} - CodeSandbox</title>
      </Helmet>
      <Query
        query={PATHED_SANDBOXES_CONTENT_QUERY}
        variables={{ path, teamId }}
      >
        {({ loading, error, data }) => (
          <Observer>
            {({ state }) => {
              if (error) {
                console.error(error);
                return <div>Error!</div>;
              }

              const sandboxes =
                loading || !data.me || !data.me.collection
                  ? []
                  : data.me.collection.sandboxes;

              const possibleTemplates = getPossibleTemplates(sandboxes);

              // We want to hide all templates
              // TODO: make this a query variable for graphql and move the logic to the server
              const noTemplateSandboxes = sandboxes.filter(
                s => !s.customTemplate
              );
              const orderedSandboxes = state.dashboard.getFilteredSandboxes(
                noTemplateSandboxes
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
                    <CreateNewSandboxButton
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
                  // Fix React Virtualized First
                  // SubHeader={
                  //   <Folders me={data.me} loading={loading} teamId={teamId} />
                  // }
                  sandboxes={orderedSandboxes}
                />
              );
            }}
          </Observer>
        )}
      </Query>
    </>
  );
};

export default PathedSandboxes;
