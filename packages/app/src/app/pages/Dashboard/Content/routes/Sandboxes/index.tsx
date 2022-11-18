import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { useAppState, useActions } from 'app/overmind';
import { Element, MessageStripe } from '@codesandbox/components';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { useSubscription } from 'app/hooks/useSubscription';
import { useGetCheckoutURL } from 'app/hooks/useCreateCheckout';
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

  const { isTeamAdmin, isPersonalSpace } = useWorkspaceAuthorization();
  const {
    hasActiveSubscription,
    isEligibleForTrial,
    hasMaxPublicSandboxes,
  } = useSubscription();

  const checkout = useGetCheckoutURL({
    team_id:
      (isTeamAdmin || isPersonalSpace) && !hasActiveSubscription
        ? activeTeam
        : undefined,
    success_path: dashboardUrls.registrySettings(activeTeam),
    cancel_path: dashboardUrls.registrySettings(activeTeam),
  });

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

      {!hasActiveSubscription && hasMaxPublicSandboxes ? (
        <Element paddingX={4} paddingY={2}>
          <MessageStripe justify="space-between">
            Free teams are limited to 20 public sandboxes. Upgrade for unlimited
            sandboxes.
            {isTeamAdmin ? (
              <MessageStripe.Action
                {...(checkout.state === 'READY'
                  ? {
                      as: 'a',
                      href: checkout.url,
                    }
                  : {
                      as: Link,
                      to: '/pro',
                    })}
                onClick={() =>
                  isEligibleForTrial
                    ? track('Limit banner: sandboxes - Start Trial', {
                        codesandbox: 'V1',
                        event_source: 'UI',
                      })
                    : track('Limit banner: sandboxes - Upgrade', {
                        codesandbox: 'V1',
                        event_source: 'UI',
                      })
                }
              >
                {isEligibleForTrial ? 'Start free trial' : 'Upgrade now'}
              </MessageStripe.Action>
            ) : (
              <MessageStripe.Action
                as="a"
                href="https://codesandbox.io/docs/learn/plan-billing/trials"
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  track('Limit banner: sandboxes - Learn More', {
                    codesandbox: 'V1',
                    event_source: 'UI',
                  });
                }}
              >
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
