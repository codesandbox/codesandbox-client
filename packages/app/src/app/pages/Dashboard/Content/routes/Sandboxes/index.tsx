import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import track from '@codesandbox/common/lib/utils/analytics';
import { CreateCard } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { getPossibleTemplates } from '../../utils';
import { useFilteredItems } from './useFilteredItems';

export const SandboxesPage = () => {
  const [level, setLevel] = React.useState(0);
  const [creating, setCreating] = React.useState(false);
  const params = useParams<{ path: string }>();
  const currentPath = decodeURIComponent(params.path || '');
  const cleanParam = currentPath.split(' ').join('{}');
  const items = useFilteredItems(currentPath, cleanParam, level);
  const actions = useActions();
  const {
    dashboard: { allCollections, sandboxes },
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

  const activeSandboxes = sandboxes.ALL && sandboxes.ALL[cleanParam];
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
              actions.modals.newSandboxModal.open({
                collectionId: currentCollection.id,
              });
            }
          : null
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
        templates={getPossibleTemplates(activeSandboxes || [])}
        createNewFolder={() => setCreating(true)}
        showViewOptions={!isEmpty}
        showFilters={!isEmpty && Boolean(currentPath)}
        showSortOptions={!isEmpty && Boolean(currentPath)}
      />

      {isEmpty ? (
        <EmptyPage.StyledWrapper>
          <EmptyPage.StyledGrid>
            <CreateCard
              icon="plus"
              title="New sandbox"
              onClick={() => {
                track('Empty State Card - Open create modal', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                  card_type: 'get-started-action',
                  tab: 'default',
                });

                actions.openCreateSandboxModal();
              }}
            />
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
