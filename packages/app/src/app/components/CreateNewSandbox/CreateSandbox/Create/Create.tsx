import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import {
  LIST_TEMPLATES,
  unmakeTemplates,
  LIST_FOLLOWED_TEMPLATES,
  makeTemplates,
} from 'app/components/CreateNewSandbox/queries';
import { Scrollable } from '@codesandbox/common/lib/components/Scrollable';
import { GridList } from '@codesandbox/common/lib/components/GridList';
import { SandboxCard } from '../SandboxCard';
import { Loader } from '../Loader/index';
import { Header } from '../elements';
import { SubHeader } from './elements';
import { all } from '../availableTemplates';

// Would be good to actually have this interface filled out
// Would be better if we could generate types from our GraphQL server
interface ListTemplatesResponse {
  me?: any;
}

export const Create = () => {
  const { data: mine = {}, error: mineError } = useQuery<ListTemplatesResponse>(
    LIST_TEMPLATES,
    {
      variables: { showAll: true },
      fetchPolicy: 'cache-and-network',
    }
  );
  const { data: followed = {}, error: followedError } = useQuery<
    ListTemplatesResponse
  >(LIST_FOLLOWED_TEMPLATES, {
    variables: { showAll: true },
    fetchPolicy: 'cache-and-network',
  });

  const done =
    (mine.me &&
      mine.me.templates &&
      followed.me &&
      followed.me.followedTemplates) ||
    followedError ||
    mineError;

  return (
    <>
      <Header>
        <span>Create Sandbox</span>
      </Header>
      {done ? (
        <Scrollable>
          {mine.me && mine.me.templates.length ? (
            <>
              <SubHeader>My Templates</SubHeader>
              <GridList>
                {mine.me.templates.map(template => (
                  <SandboxCard
                    mine
                    key={template.niceName}
                    template={template}
                  />
                ))}
              </GridList>
            </>
          ) : null}
          {followed.me &&
          followed.me.followedTemplates &&
          followed.me.followedTemplates.length ? (
            <>
              <SubHeader>Templates followed by me</SubHeader>
              <GridList>
                {followed.me.followedTemplates.map((template, i) => (
                  <SandboxCard
                    onUnfollow={id => unmakeTemplates([id])}
                    followed
                    official={!template.sandbox}
                    key={template.niceName}
                    template={template}
                  />
                ))}
              </GridList>
            </>
          ) : null}
          {followed.me &&
            followed.me.teams &&
            followed.me.teams.map(team =>
              team.followedTemplates.length ? (
                <>
                  <SubHeader>Templates followed by {team.name} team</SubHeader>
                  <GridList>
                    {team.followedTemplates.map(template => (
                      <SandboxCard
                        onUnfollow={id => unmakeTemplates([id], team.id)}
                        followed
                        official={!template.sandbox}
                        key={template.niceName}
                        template={template}
                      />
                    ))}
                  </GridList>
                </>
              ) : null
            )}
          <SubHeader>Official Templates</SubHeader>
          <GridList aria-label="Official Templates">
            {all.map(template => (
              <SandboxCard
                official
                onFollow={id => makeTemplates(id)}
                key={template.niceName}
                template={template}
              />
            ))}
          </GridList>
        </Scrollable>
      ) : (
        <Loader />
      )}
    </>
  );
};
