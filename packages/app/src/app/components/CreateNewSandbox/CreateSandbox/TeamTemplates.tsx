import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  ListPersonalTemplatesQuery,
  ListPersonalTemplatesQueryVariables,
  TemplateFragment,
} from 'app/graphql/types';
import { LIST_PERSONAL_TEMPLATES } from '../queries';
import { Loader } from './Loader';
import { TemplateGrid } from './elements';
import { TemplateCard } from './TemplateCard';

function getUserTemplates(data: ListPersonalTemplatesQuery) {
  return data.me.templates;
}

function getTeamTemplates(data: ListPersonalTemplatesQuery, teamId: string) {
  return data.me.teams.find(team => team.id === teamId).templates;
}

interface TeamTemplatesProps {
  isUser: boolean;
  teamId: string;
  selectTemplate: (template: TemplateFragment) => void;
}

export const TeamTemplates = ({
  isUser,
  teamId,
  selectTemplate,
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

  return (
    <TemplateGrid>
      {templates.length > 0 ? (
        templates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            selectTemplate={selectTemplate}
          />
        ))
      ) : (
        <div>No templates yet!</div>
      )}
    </TemplateGrid>
  );
};
