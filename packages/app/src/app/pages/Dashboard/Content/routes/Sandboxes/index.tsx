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
              actions.modalOpened({
                modal: 'createSandbox',
                itemId: currentCollection.id,
              });
            }
          : undefined
      }
      createNewDevbox={
        currentCollection
          ? () => {
              actions.modalOpened({
                modal: 'createDevbox',
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
              icon="boxDevbox"
              title="Create devbox"
              onClick={() => {
                track('Empty Folder - Create devbox', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });

                actions.modalOpened({ modal: 'createDevbox' });
              }}
            />
            <CreateCard
              icon="boxSandbox"
              title="Create sandbox"
              onClick={() => {
                track('Empty Folder - Create sandbox', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                  card_type: 'get-started-action',
                  tab: 'default',
                });

                actions.modalOpened({ modal: 'createSandbox' });
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
