import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import DelayedAnimation from 'app/components/DelayedAnimation';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import history from 'app/utils/history';
import CustomTemplate from '@codesandbox/common/lib/components/CustomTemplate';
import { LIST_TEMPLATES } from '../../../queries';
import { Container, Grid } from './elements';
import { Navigation } from './Navigation';

export const Templates = props => {
  const teamId = props.match.params.teamId;

  const { loading, error, data } = useQuery(LIST_TEMPLATES, {
    variables: { teamId },
  });

  useEffect(() => {
    document.title = `${teamId ? 'Our' : 'My'} Templates - CodeSandbox`;
  }, []);

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

  return (
    <Container>
      <Navigation teamId={teamId} number={data.me.templates.length} />
      <Grid>
        {data.me.templates.map((template, i) => (
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
