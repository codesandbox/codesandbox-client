import { ArticleCard, CreateCard } from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import React from 'react';
import { useActions } from 'app/overmind';
import { EmptyPage } from '../../../Components/EmptyPage';

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
          label="Import from GitHub"
          onClick={() => {
            track('Repositories - open import modal from empty state', {
              codesandbox: 'V1',
              event_source: 'UI',
            });
            actions.openCreateSandboxModal({ initialTab: 'import' });
          }}
        />
        <ArticleCard
          title="More about repositories"
          thumbnail="/static/img/thumbnails/repositories.jpg"
          url="https://codesandbox.io/docs/learn/repositories/overview"
          onClick={() => track('Repositories - open docs from empty state')}
        />
      </EmptyPage.StyledGrid>
    </EmptyPage.StyledWrapper>
  );
};
