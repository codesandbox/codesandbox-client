import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  ListTemplatesQuery,
  ListBookmarkedTemplatesQuery,
  ListBookmarkedTemplatesQueryVariables,
  ListTemplatesQueryVariables,
} from 'app/graphql/types';
import { LIST_OWNED_TEMPLATES, LIST_BOOKMARKED_TEMPLATES } from 'app/components/CreateNewSandbox/queries';
import { Loader } from '../../Loader/index';
import { TemplateList } from './TemplateList';
import { CenteredMessage } from '../elements';

export const PersonalTemplates = () => {
  const { data: mine, error: mineError } = useQuery<
    ListTemplatesQuery,
    ListTemplatesQueryVariables
  >(LIST_OWNED_TEMPLATES, {
    variables: { showAll: true, teamId: undefined },
    fetchPolicy: 'cache-and-network',
  });
  const { data: bookmarked, error: bookmarkedError } = useQuery<
    ListBookmarkedTemplatesQuery,
    ListBookmarkedTemplatesQueryVariables
  >(LIST_BOOKMARKED_TEMPLATES, {
    variables: { showAll: true },
    fetchPolicy: 'cache-and-network',
  });

  if (mineError || bookmarkedError) {
    return <CenteredMessage>An error has occurred while fetching your templates, please try again in a minute</CenteredMessage>;
  }

  const isDone =
    mine?.me?.templates &&
    bookmarked?.me?.bookmarkedTemplates;

  return (
    <>
      {isDone ? (
        <>
          {mine.me.templates.length ? (
            <TemplateList
              templates={mine.me.templates}
              title="Your Templates"
            />
          ) : null}
          {bookmarked.me.bookmarkedTemplates.length ? (
            <TemplateList
              templates={bookmarked.me.bookmarkedTemplates}
              title="Bookmarked Templates"
            />
          ) : null}
          {bookmarked.me.teams.map(team =>
            team.bookmarkedTemplates.length ? (
              <TemplateList
                templates={team.bookmarkedTemplates}
                title={`Bookmarked Templates by ${team.name}`}
              />
            ) : null
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
