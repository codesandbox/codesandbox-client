import track from '@codesandbox/common/lib/utils/analytics';
import {
  v2DefaultBranchUrl,
  docsUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { ArticleCard, CreateCard, Element } from '@codesandbox/components';
import { useAppState } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { appendOnboardingTracking } from 'app/pages/Dashboard/Content/utils';
import React from 'react';

const DESCRIPTION =
  "Open any open-source repository on CodeSandbox and click on 'Branch' to start contributing.<br />Don't worry about forking and setting up a new repository. We'll take care of everything for you.";

const SUGGESTED_REPOS = [
  {
    owner: 'codesandbox',
    name: 'sandpack',
  },
  {
    owner: 'excalidraw',
    name: 'excalidraw',
  },
  {
    owner: 'pmndrs',
    name: 'react-three-fiber',
  },
];

export const EmptyContributions: React.FC = () => {
  const { activeTeam } = useAppState();

  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledDescription
        as="p"
        dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
      />
      <EmptyPage.StyledGridWrapper>
        <EmptyPage.StyledGridTitle>
          Start contributing
        </EmptyPage.StyledGridTitle>
        <EmptyPage.StyledGrid as="ul">
          {SUGGESTED_REPOS.map(({ owner, name }) => {
            const slug = `${owner}/${name}`;
            const url = v2DefaultBranchUrl({
              owner,
              repoName: name,
              workspaceId: activeTeam,
              source: 'dashboard_onboarding',
            });

            return (
              <Element as="li" key={slug}>
                <CreateCard
                  icon="repository"
                  label={owner}
                  title={name}
                  onClick={() => {
                    track('Empty State Card - Open suggested repository', {
                      repo: slug,
                      codesandbox: 'V1',
                      event_source: 'UI',
                      card_type: 'get-started-action',
                    });

                    window.location.href = url;
                  }}
                />
              </Element>
            );
          })}
          <ArticleCard
            title="More about Contribution Branches"
            thumbnail="/static/img/thumbnails/page_contributions.png"
            onClick={() =>
              track('Empty State Card - Content card', {
                codesandbox: 'V1',
                event_source: 'UI',
                card_type: 'blog-contribution-branches',
              })
            }
            url={appendOnboardingTracking(
              docsUrl(
                '/learn/getting-started/open-source#introducing-contribution-branches'
              )
            )}
          />
        </EmptyPage.StyledGrid>
      </EmptyPage.StyledGridWrapper>
    </EmptyPage.StyledWrapper>
  );
};
