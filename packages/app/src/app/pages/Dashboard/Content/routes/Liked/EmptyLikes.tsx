import { Element, Stack } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { GUTTER } from 'app/pages/Dashboard/Components/VariableGrid/constants';
import { DashboardGridItem } from 'app/pages/Dashboard/types';
import React from 'react';

const TRENDING_COLLECTION_ID = 'nynbnp';
const SANDBOXES_TO_SHOW_COUNT = 4;

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

  let pageState: 'loading' | 'empty' | 'ready';
  if (!suggestedSandboxes) {
    pageState = 'loading';
  } else if (itemsToShow.length === 0) {
    pageState = 'empty'; // error or no items
  } else {
    pageState = 'ready';
  }

  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledDescription
        as="p"
        dangerouslySetInnerHTML={{ __html: DESCRIPTION }}
      />
      {pageState !== 'empty' ? (
        <Stack css={{ flex: 1 }} direction="vertical" gap={4}>
          <EmptyPage.StyledGridTitle>
            Discover exciting projects
          </EmptyPage.StyledGridTitle>
          <Element
            css={{
              height: '100%',
              // Override the margins built-in the VariableGrid.
              margin: `0 -${GUTTER}px `,
            }}
          >
            <VariableGrid items={itemsToShow} page="liked" />
          </Element>
        </Stack>
      ) : null}
    </EmptyPage.StyledWrapper>
  );
};
