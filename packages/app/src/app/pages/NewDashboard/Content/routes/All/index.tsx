import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useHistory } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import { DashboardGridItem } from 'app/pages/NewDashboard/types';
import { getPossibleTemplates } from '../../utils';
import { useFilteredItems } from './useFilteredItems';

export const AllPage = () => {
  const [level, setLevel] = React.useState(0);
  const [creating, setCreating] = React.useState(false);
  const params = useParams<{ path: string }>();
  const history = useHistory();
  const items = useFilteredItems(params, level);
  const param = params.path || '';
  const cleanParam = param.split(' ').join('{}');
  const {
    actions,
    state: {
      dashboard: { allCollections, sandboxes },
      activeTeam,
    },
  } = useOvermind();
  const [localTeam, setLocalTeam] = React.useState(activeTeam);

  React.useEffect(() => {
    actions.dashboard.getAllFolders();
  }, [actions.dashboard, activeTeam]);

  React.useEffect(() => {
    if (localTeam !== activeTeam) {
      setLocalTeam(activeTeam);

      if (params) {
        history.push('/new-dashboard/all/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  React.useEffect(() => {
    if (!param || param === '/') {
      setLevel(0);
    } else {
      setLevel(param.split('/').length);
    }
    actions.dashboard.getSandboxesByPath(param);
  }, [param, actions.dashboard, activeTeam]);

  const activeSandboxes = (sandboxes.ALL && sandboxes.ALL[cleanParam]) || [];

  const itemsToShow: DashboardGridItem[] = allCollections
    ? [
        creating
          ? { type: 'new-folder' as 'new-folder', setCreating }
          : undefined,
        ...items,
      ].filter(exists => exists)
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  return (
    <SelectionProvider
      items={itemsToShow}
      createNewFolder={() => setCreating(true)}
    >
      <Helmet>
        <title>{param || 'Dashboard'} - CodeSandbox</title>
      </Helmet>
      <Header
        path={param}
        templates={getPossibleTemplates(activeSandboxes)}
        createNewFolder={() => setCreating(true)}
        showViewOptions
        showFilters={Boolean(param)}
        showSortOptions={Boolean(param)}
      />
      <VariableGrid items={itemsToShow} />
    </SelectionProvider>
  );
};

export const All = React.memo(AllPage);
