import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { SandboxCard } from '../../SandboxCard';
import { Loader } from '../../Loader/index';
import { SubHeader, Grid } from '../elements';
// @ts-ignore
import { ListFollowedTemplates, ListTemplates } from '../../queries.gql';

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
            <>
              <SubHeader>Your Templates</SubHeader>
              <Grid>
                {mine.me.templates.map(template => (
                  <SandboxCard
                    mine
                    key={template.niceName}
                    template={template}
                  />
                ))}
              </Grid>
            </>
          ) : null}
          {followed.me.bookmarkedTemplates.length ? (
            <>
              <SubHeader>Bookmarked Templates</SubHeader>
              <Grid>
                {followed.me.bookmarkedTemplates.map((template, i) => (
                  <SandboxCard
                    official={!template.sandbox}
                    key={template.niceName}
                    template={template}
                  />
                ))}
              </Grid>
            </>
          ) : null}
          {followed.me.teams.map(team =>
            team.bookmarkedTemplates.length ? (
              <>
                <SubHeader>Bookmarked Templates by {team.name}</SubHeader>
                <Grid>
                  {team.bookmarkedTemplates.map(template => (
                    <SandboxCard
                      team={team}
                      official={!template.sandbox}
                      key={template.niceName}
                      template={template}
                    />
                  ))}
                </Grid>
              </>
            ) : null
          )}
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};
