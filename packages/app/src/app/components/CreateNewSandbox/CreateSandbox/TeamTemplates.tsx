import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  ListPersonalTemplatesQuery,
  ListPersonalTemplatesQueryVariables,
  TemplateFragment,
} from 'app/graphql/types';
import { LIST_PERSONAL_TEMPLATES } from '../queries';
import { Loader } from './Loader';
import { TemplateCategoryList } from './TemplateCategoryList';

function getUserTemplates(data: ListPersonalTemplatesQuery) {
  return data.me.templates;
}

function getTeamTemplates(data: ListPersonalTemplatesQuery, teamId: string) {
  return data.me.teams.find(team => team.id === teamId).templates;
}

function getTeamName(data: ListPersonalTemplatesQuery, teamId: string): string {
  return data.me.teams.find(team => team.id === teamId)?.name || 'Team';
}

interface TeamTemplatesProps {
  isUser: boolean;
  teamId: string;
  onSelectTemplate: (template: TemplateFragment) => void;
}

export const TeamTemplates = ({
  isUser,
  teamId,
  onSelectTemplate,
}: TeamTemplatesProps) => {
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

  if (error) {
    return (
      <p>
        Something went wrong while fetching your templates, please try again in
        a minute.
      </p>
    );
  }

  // Instead of checking the loading var we check this. Apollo sets the loading
  // var to true even if we still have cached data that we can use. We  also need to
  // check if `data.me` isnt undefined before getting templates.
  if (typeof data?.me === 'undefined') {
    return <Loader />;
  }

  const templates = isUser
    ? getUserTemplates(data)
    : getTeamTemplates(data, teamId);

  const teamName = isUser ? 'Personal' : getTeamName(data, teamId);

  return (
    <TemplateCategoryList
      title={`${teamName} templates`}
      templates={templates}
      onSelectTemplate={onSelectTemplate}
    />
  );
};
