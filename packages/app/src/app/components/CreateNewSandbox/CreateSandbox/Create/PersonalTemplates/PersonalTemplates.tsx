import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  ListTemplatesQuery,
  ListFollowedTemplatesQuery,
  ListFollowedTemplatesQueryVariables,
  ListTemplatesQueryVariables,
} from 'app/graphql/types';
import { Loader } from '../../Loader/index';
// @ts-ignore
import { ListFollowedTemplates, ListTemplates } from '../../queries.gql';
import { TemplateList } from './TemplateList';

export const PersonalTemplates = () => {
  const { data: mine, error: mineError } = useQuery<
    ListTemplatesQuery,
    ListTemplatesQueryVariables
  >(ListTemplates, {
    variables: { showAll: true, teamId: undefined },
    fetchPolicy: 'cache-and-network',
  });
  const { data: followed, error: followedError } = useQuery<
    ListFollowedTemplatesQuery,
    ListFollowedTemplatesQueryVariables
  >(ListFollowedTemplates, {
    variables: { showAll: true },
    fetchPolicy: 'cache-and-network',
  });

  const done =
    (mine &&
      mine.me &&
      mine.me.templates &&
      followed &&
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
