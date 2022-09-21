import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  ListPersonalTemplatesQuery,
  ListPersonalTemplatesQueryVariables,
} from 'app/graphql/types';
import { LIST_PERSONAL_TEMPLATES } from '../queries';
import { Loader } from './Loader';

function getUserTemplates(data: ListPersonalTemplatesQuery) {
  return data.me.templates;
}

function getTeamTemplates(data: ListPersonalTemplatesQuery, teamId: string) {
  return data.me.teams.find(team => team.id === teamId).templates;
}

export const TeamTemplates = ({ isUser, teamId }) => {
  const { data, error } = useQuery<
    ListPersonalTemplatesQuery,
    ListPersonalTemplatesQueryVariables
  >(LIST_PERSONAL_TEMPLATES, {
    /**
     * With LIST_PERSONAL_TEMPLATES we're also fetching team templates. We're reusing
     * this query here because it has already been preloaded and cached by overmind. We're
     * filtering what we need later.
     */
    variables: {},
    fetchPolicy: 'cache-and-network',
  });

  const templates = isUser
    ? getUserTemplates(data)
    : getTeamTemplates(data, teamId);

  if (error) {
    return (
      <p>
        Something went wrong while fetching your templates, please try again in
        a minute.
      </p>
    );
  }

  // Instead of checking the loading var we check this. Apollo sets the loading
  // var to true even if we still have cached data that we can use.
  if (typeof data?.me === 'undefined') {
    return <Loader />;
  }

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>{template.sandbox.title}</div>
      ))}
    </div>
  );
};
