import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Element, MessageStripe } from '@codesandbox/components';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { useSubscription } from 'app/hooks/useSubscription';
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

  // 🚧 TODO: hasMaxSandboxes property (or something like it) is something that will
  // be returned from an API. Can be implemented when ready.
  const hasMaxSandboxes = false;

  const {
    isTeamAdmin,
    hasActiveSubscription,
    isEligibleForTrial,
  } = useSubscription();

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
          {currentPath.split('/').pop() || 'Dashboard'} - CodeSandbox
        </title>
      </Helmet>
      <Header
        activeTeam={activeTeam}
        path={currentPath}
        templates={getPossibleTemplates(activeSandboxes || [])}
        createNewFolder={() => setCreating(true)}
        showViewOptions
        showFilters={Boolean(currentPath)}
        showSortOptions={Boolean(currentPath)}
      />

      {!hasActiveSubscription && hasMaxSandboxes ? (
        <Element paddingX={4} paddingY={2}>
          <MessageStripe justify="space-between">
            Free teams are limited to 20 public sandboxes. Upgrade for unlimited
            sandboxes.
            {isTeamAdmin ? (
              <MessageStripe.Action as={Link} to="/pro">
                {isEligibleForTrial ? 'Start free trial' : 'Upgrade now'}
              </MessageStripe.Action>
            ) : (
              // ❗️ TODO: Confirm that this link should go to /pricing
              <MessageStripe.Action as={Link} to="/pricing">
                Learn more
              </MessageStripe.Action>
            )}
          </MessageStripe>
        </Element>
      ) : null}

      <VariableGrid
        page={pageType}
        collectionId={currentCollection?.id}
        items={itemsToShow}
      />
    </SelectionProvider>
  );
};

export const Sandboxes = React.memo(SandboxesPage);
