import React, { useEffect } from 'react';
import { sortBy } from 'lodash-es';
import { useQuery } from '@apollo/react-hooks';
import { Button } from '@codesandbox/common/lib/components/Button';
import DelayedAnimation from 'app/components/DelayedAnimation';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import history from 'app/utils/history';
import CustomTemplate from '@codesandbox/common/lib/components/CustomTemplate';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { LIST_TEMPLATES } from '../../../queries';
import { Container, Grid, EmptyTitle, Buttons } from './elements';
import { Navigation } from './Navigation';

export const Templates = props => {
  const teamId = props.match.params.teamId;

  const { loading, error, data } = useQuery(LIST_TEMPLATES, {
    variables: { teamId },
  });

  useEffect(() => {
    document.title = `${teamId ? 'Our' : 'My'} Templates - CodeSandbox`;
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
            You have not made any templates yet.
            <br />
            Learn more about Templates in de documentation.
          </EmptyTitle>
          <Buttons>
            <Button small secondary to={'/s'}>
              Create Sandbox
            </Button>
            <Button small to={'/docs/templates'}>
              Learn More
            </Button>
          </Buttons>
        </div>
      )}
      <Grid>
        {sortedTemplates.map((template, i) => (
          <CustomTemplate
            i={i}
            template={template}
            onClick={() => history.push(sandboxUrl(template.sandbox))}
          />
        ))}
      </Grid>
    </Container>
  );
};
