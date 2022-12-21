import { ArticleCard, CreateCard } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import React from 'react';
import { useActions } from 'app/overmind';
import { EmptyPage } from '../../../Components/EmptyPage';
import { appendOnboardingTracking } from '../Recent/DocumentationRow';

const DESCRIPTION =
  'Save hours every week by shortening the review cycle and empowering everyone to contribute.<br />Every branch in Repositories is connected to git and has its own sandbox running in a fast microVM.';

export const EmptyRepositories: React.FC = () => {
  const actions = useActions();

  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledDescription
        as="p"
        dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
      />
      <EmptyPage.StyledGrid>
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
          thumbnail="/static/img/thumbnails/repositories.jpg"
          url={appendOnboardingTracking(
            'https://codesandbox.io/docs/learn/repositories/overview'
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
    </EmptyPage.StyledWrapper>
  );
};
