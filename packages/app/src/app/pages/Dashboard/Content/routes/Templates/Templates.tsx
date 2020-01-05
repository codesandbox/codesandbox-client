import React from 'react';
import { Helmet } from 'react-helmet';
import { RouteComponentProps } from 'react-router';
import { Container } from './elements';
import { BookmarkedTemplates } from './BookmarkedTemplates';
import { OwnedTemplates } from './OwnedTemplates';

type TemplatesProps = RouteComponentProps<{ teamId: string }> & {};

export const Templates = (props: TemplatesProps) => {
  const { teamId } = props.match.params;

  return (
    <Container>
      <Helmet>
        <title>{teamId ? 'Team' : 'My'} Templates - CodeSandbox</title>
      </Helmet>

      <OwnedTemplates teamId={teamId} />
      <BookmarkedTemplates teamId={teamId} />
    </Container>
  );
};
