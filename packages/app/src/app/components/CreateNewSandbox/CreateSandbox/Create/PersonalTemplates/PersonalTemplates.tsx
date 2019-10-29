import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Loader } from '../../Loader/index';
// @ts-ignore
import { ListFollowedTemplates, ListTemplates } from '../../queries.gql';
import { TemplateList } from './TemplateList';

// Would be good to actually have this interface filled out
// Would be better if we could generate types from our GraphQL server
interface ListTemplatesResponse {
  me?: any;
}

export const PersonalTemplates = () => {
  const { data: mine = {}, error: mineError } = useQuery<ListTemplatesResponse>(
    ListTemplates,
    {
      variables: { showAll: true },
      fetchPolicy: 'cache-and-network',
    }
  );
  const { data: followed = {}, error: followedError } = useQuery<
    ListTemplatesResponse
  >(ListFollowedTemplates, {
    variables: { showAll: true },
    fetchPolicy: 'cache-and-network',
  });

  const done =
    (mine.me &&
      mine.me.templates &&
      followed.me &&
      followed.me.bookmarkedTemplates) ||
    followedError ||
    mineError;

  return (
    <>
      {done ? (
        <>
          {mine.me.templates.length ? (
            <TemplateList
              templates={mine.me.templates}
              title="Your Templates"
            />
          ) : null}
          {followed.me.bookmarkedTemplates.length ? (
            <TemplateList
              templates={followed.me.bookmarkedTemplates}
              title="Bookmarked Templates"
            />
          ) : null}
          {followed.me.teams.map(team =>
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
