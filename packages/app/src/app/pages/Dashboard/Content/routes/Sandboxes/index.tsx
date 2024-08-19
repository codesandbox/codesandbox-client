import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import track from '@codesandbox/common/lib/utils/analytics';
import { useAppState, useActions } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { ActionCard } from 'app/pages/Dashboard/Components/shared/ActionCard';
import { useFilteredItems } from './useFilteredItems';

export const SandboxesPage = () => {
  const [level, setLevel] = React.useState(0);
  const [creating, setCreating] = React.useState(false);
  const params = useParams<{ path: string }>();
  const currentPath = decodeURIComponent(params.path || '');
  const cleanParam = currentPath.split(' ').join('{}');
  const items = useFilteredItems(currentPath, cleanParam, level);
  const actions = useActions();
  const { isFrozen } = useWorkspaceLimits();
  const {
    dashboard: { allCollections },
    activeTeam,
  } = useAppState();

  React.useEffect(() => {
    if (!currentPath || currentPath === '/') {
      setLevel(0);
    } else {
      setLevel(currentPath.split('/').length);
    }
    actions.dashboard.getSandboxesByPath(currentPath);
  }, [currentPath, actions.dashboard, activeTeam]);

  const itemsToShow: DashboardGridItem[] = allCollections
    ? [
        creating && {
          type: 'new-folder' as 'new-folder',
          basePath: currentPath,
          setCreating,
        },
        ...items,
      ].filter(Boolean)
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const currentCollection = allCollections?.find(
    c => c.path === '/' + currentPath
  );

  const pageType: PageTypes = 'sandboxes';
  const isEmpty = itemsToShow.length === 0;

  return (
    <SelectionProvider
      items={itemsToShow}
      page={pageType}
      activeTeamId={activeTeam}
      createNewFolder={() => setCreating(true)}
      createNewSandbox={
        currentCollection
          ? () => {
              actions.modalOpened({
                modal: 'create',
                itemId: currentCollection.id,
              });
            }
          : undefined
      }
    >
      <Helmet>
        <title>
          {currentPath.split('/').pop() || 'Sandboxes'} - CodeSandbox
        </title>
      </Helmet>

      <Header
        activeTeam={activeTeam}
        path={currentPath}
        createNewFolder={() => setCreating(true)}
        showViewOptions={!isEmpty}
        showSortOptions={!isEmpty && Boolean(currentPath)}
      />

      {isEmpty ? (
        <EmptyPage.StyledWrapper>
          <EmptyPage.StyledGrid>
            <ActionCard
              icon="plus"
              disabled={isFrozen}
              onClick={() => {
                track('Empty Folder - Create devbox', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });

                actions.modalOpened({
                  modal: 'create',
                  itemId: currentCollection.id,
                });
              }}
            >
              Create
            </ActionCard>
          </EmptyPage.StyledGrid>
        </EmptyPage.StyledWrapper>
      ) : (
        <VariableGrid
          page={pageType}
          collectionId={currentCollection?.id}
          items={itemsToShow}
        />
      )}
    </SelectionProvider>
  );
};

export const Sandboxes = React.memo(SandboxesPage);
