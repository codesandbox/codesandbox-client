import { Element, Stack } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import {
  VariableGrid,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem } from 'app/pages/Dashboard/types';
import React from 'react';

const TRENDING_COLLECTION_ID = 'nynbnp';
const SANDBOXES_TO_SHOW_COUNT = 5;

const DESCRIPTION =
  'Discover, explore and share the love. There are more than 30 million sandboxes created with CodeSandbox.<br />Share your appreciation for your favorites and they will appear here.';

export const EmptyLikes: React.FC = () => {
  const { dashboard } = useAppState();
  const actions = useActions();
  const suggestedSandboxes =
    dashboard.curatedAlbumsById?.[TRENDING_COLLECTION_ID];

  React.useEffect(() => {
    if (!suggestedSandboxes) {
      actions.dashboard.getCuratedAlbumById({
        albumId: TRENDING_COLLECTION_ID,
      });
    }
  }, []);

  const getItemsToShow = (): DashboardGridItem[] => {
    if (!suggestedSandboxes) {
      return [{ type: 'skeleton-row' }];
    }

    return suggestedSandboxes.sandboxes
      .slice(0, SANDBOXES_TO_SHOW_COUNT)
      .map(sandbox => ({
        type: 'sandbox',
        sandbox,
      }));
  };

  const itemsToShow = getItemsToShow();

  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledDescription
        as="p"
        dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
      />
      <Stack css={{ flex: 1 }} direction="vertical" gap={6}>
        <EmptyPage.StyledGridTitle>
          Discover exciting projects
        </EmptyPage.StyledGridTitle>
        <Element
          css={{
            height: '100%',
            // Override the margins built-in the VariableGrid.
            margin: `-28px -${GUTTER}px 0`,
          }}
        >
          <VariableGrid items={itemsToShow} page="liked" />
        </Element>
      </Stack>
    </EmptyPage.StyledWrapper>
  );
};
