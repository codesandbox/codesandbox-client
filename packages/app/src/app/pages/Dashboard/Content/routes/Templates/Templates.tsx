import React, { useEffect } from 'react';
import { sortBy } from 'lodash-es';
import { useQuery } from '@apollo/react-hooks';
import track from '@codesandbox/common/lib/utils/analytics';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import CustomTemplate from '@codesandbox/common/lib/components/CustomTemplate';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { DelayedAnimation } from 'app/components/DelayedAnimation';
import history from 'app/utils/history';
import ContextMenu from 'app/components/ContextMenu';
import { LIST_TEMPLATES, unmakeTemplates } from '../../../queries';
import { Container, Grid, EmptyTitle } from './elements';
import { Navigation } from './Navigation';

export const Templates = props => {
  const teamId = props.match.params.teamId;

  const { loading, error, data } = useQuery(LIST_TEMPLATES, {
    variables: { teamId },
  });

  useEffect(() => {
    document.title = `${teamId ? 'Team' : 'My'} Templates - CodeSandbox`;
  }, [teamId]);

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
        Fetching Sandboxes...
      </DelayedAnimation>
    );
  }

  const sortedTemplates = sortBy(data.me.templates, template =>
    getSandboxName(template.sandbox).toLowerCase()
  );

  return (
    <Container>
      <Navigation teamId={teamId} number={sortedTemplates.length} />
      {!sortedTemplates.length && (
        <div>
          <EmptyTitle>
            <p style={{ marginBottom: '0.5rem' }}>
              You have not created any templates yet. You can create a template
              by dragging a sandbox from "My Sandboxes" to here or by clicking
              "Create Template" from the editor.
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
              {
                title: 'Convert to Sandbox',
                action: () => {
                  track('Template - Removed', { source: 'Context Menu' });
                  unmakeTemplates([template.sandbox.id], teamId);
                  return true;
                },
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
    </Container>
  );
};
