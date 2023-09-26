import React from 'react';

import { ArticleCard, CreateCard, Element } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import { docsUrl } from '@codesandbox/common/lib/utils/url-generator';

import { useActions } from 'app/overmind';
import { appendOnboardingTracking } from 'app/pages/Dashboard/Content/utils';
import { RestrictedImportDisclaimer } from 'app/pages/Dashboard/Components/shared/RestrictedImportDisclaimer';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { SuggestionsRow } from 'app/pages/Dashboard/Components/SuggestionsRow/SuggestionsRow';
import { useGitHubPermissions } from 'app/hooks/useGitHubPermissions';

const DESCRIPTION =
  'Save hours every week by shortening the review cycle and empowering everyone to contribute.<br />Every branch in Repositories is connected to git and has its own sandbox running in a fast microVM.';

export const EmptyRepositories: React.FC = () => {
  const actions = useActions();
  const { restrictsPublicRepos } = useGitHubPermissions();

  return (
    <EmptyPage.StyledWrapper
      css={{
        gap: '16px',
      }}
    >
      <EmptyPage.StyledDescription
        as="p"
        dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
      />
      <EmptyPage.StyledGrid
        css={{
          marginTop: '16px',
        }}
      >
        <CreateCard
          icon="github"
          title="Import from GitHub"
          onClick={() => {
            track('Empty State Card - Open create modal', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'get-started-action',
              tab: 'github',
            });

            actions.openCreateSandboxModal({ initialTab: 'import' });
          }}
        />
        <ArticleCard
          title="More about repositories"
          thumbnail="/static/img/thumbnails/page_repositories.png"
          url={appendOnboardingTracking(
            docsUrl('/learn/repositories/overview')
          )}
          onClick={() =>
            track('Empty State Card - Content Card', {
              codesandbox: 'V1',
              event_source: 'UI',
              card_type: 'blog-repositories-overview',
            })
          }
        />
      </EmptyPage.StyledGrid>
      <RestrictedImportDisclaimer />
      <Element css={{ minHeight: 32 }} />
      {restrictsPublicRepos === false && (
        <SuggestionsRow page="empty repositories" />
      )}
    </EmptyPage.StyledWrapper>
  );
};
