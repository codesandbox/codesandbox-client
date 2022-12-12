import {
  ArticleCard,
  CreateCard,
  Element,
  Stack,
  Text,
} from '@codesandbox/components';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import React from 'react';
import styled from 'styled-components';
import { useActions } from 'app/overmind';

const StyledEmptyDescription = styled(Text)`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #999999;
`;

const DESCRIPTION =
  'Save hours every week by shortening the review cycle and empowering everyone to contribute.<br />Every branch in Repositories is connected to git and has its own sandbox running in a fast microVM.';

export const EmptyState: React.FC = () => {
  const actions = useActions();

  return (
    <Stack
      css={{
        width: `calc(100% - ${2 * GUTTER}px)`,
        maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
        margin: '24px auto 0',
      }}
      direction="vertical"
      gap={10}
    >
      <StyledEmptyDescription
        as="p"
        dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
      />
      <Element
        css={{
          margin: 0,
          padding: 0,
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          listStyle: 'none',
          gap: '16px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(268px, 1fr))',
          gridAutoRows: 'minmax(156px, 1fr)',
        }}
      >
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
      </Element>
    </Stack>
  );
};
