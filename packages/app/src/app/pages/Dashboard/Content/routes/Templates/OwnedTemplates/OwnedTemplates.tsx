import React from 'react';
import { sortBy } from 'lodash-es';
import { useQuery } from '@apollo/react-hooks';

import { DelayedAnimation } from 'app/components/DelayedAnimation';
import { ContextMenu } from 'app/components/ContextMenu';
import { useOvermind } from 'app/overmind';
import history from 'app/utils/history';
import track from '@codesandbox/common/lib/utils/analytics';
import theme from '@codesandbox/common/lib/theme';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import CustomTemplate from '@codesandbox/common/lib/components/CustomTemplate';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  LIST_OWNED_TEMPLATES,
  unmakeTemplates,
} from 'app/components/CreateNewSandbox/queries';
import {
  ListTemplatesQuery,
  ListTemplatesQueryVariables,
} from 'app/graphql/types';
import { Grid, EmptyTitle } from '../elements';
import { Navigation } from '../Navigation';

type OwnedTemplatesProps = { teamId?: string };

export const OwnedTemplates = (props: OwnedTemplatesProps) => {
  const {
    actions: {
      dashboard: { deleteTemplate },
    },
    effects: {
      browser: { copyToClipboard },
    },
  } = useOvermind();
  const { teamId } = props;
  const { loading, error, data, refetch } = useQuery<
    ListTemplatesQuery,
    ListTemplatesQueryVariables
  >(LIST_OWNED_TEMPLATES, {
    variables: { showAll: false },
  });

  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }

  if (loading) {
    return (
      <DelayedAnimation
        delay={0.6}
        style={{
          textAlign: 'center',
          marginTop: '2rem',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        Fetching Templates...
      </DelayedAnimation>
    );
  }

  const templatesToUse = teamId
    ? data.me.teams.find(t => t.id === teamId)?.templates
    : data.me.templates;

  const sortedTemplates = sortBy(templatesToUse, template =>
    getSandboxName(template.sandbox).toLowerCase()
  );

  return (
    <>
      <Navigation teamId={teamId} number={sortedTemplates.length} />
      {!sortedTemplates.length && (
        <div>
          <EmptyTitle>
            <p style={{ marginBottom: '0.5rem' }}>
              You have not created any templates yet. You can create a template
              by dragging a sandbox from {'"'}My Sandboxes{'"'} to here or by
              clicking {'"'}Create Template{'"'} from the editor.
            </p>
            You can learn more about templates{' '}
            <a href="/docs/templates" target="_blank">
              here
            </a>
            .
          </EmptyTitle>
        </div>
      )}
      <Grid>
        {sortedTemplates.map((template, i) => (
          <ContextMenu
            items={[
              [
                {
                  title: 'Convert to Sandbox',
                  action: () => {
                    track('Template - Removed', { source: 'Context Menu' });
                    unmakeTemplates([template.sandbox.id]);
                    return true;
                  },
                },
                {
                  title: 'Copy Template Link',
                  action: () => {
                    copyToClipboard(
                      `https://codesandbox.io${sandboxUrl(template.sandbox)}`
                    );
                    return true;
                  },
                },
              ],
              {
                title: `Delete Template`,
                action: () => {
                  deleteTemplate({
                    sandboxId: template.sandbox.id,
                    templateId: template.id,
                  }).then(() => refetch());
                  return true;
                },
                color: theme.red.darken(0.2)(),
              },
            ]}
            key={template.id}
          >
            <CustomTemplate
              i={i}
              template={template}
              onClick={() => history.push(sandboxUrl(template.sandbox))}
            />
          </ContextMenu>
        ))}
      </Grid>
    </>
  );
};
