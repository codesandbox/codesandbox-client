import React from 'react';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { VariableGrid } from 'app/pages/NewDashboard/Components/VariableGrid';
import { getPossibleTemplates } from '../../utils';
import { useFilteredItems } from './useFilteredItems';

export const AllPage = ({ match: { params }, history }) => {
  const [level, setLevel] = React.useState(0);
  const [creating, setCreating] = React.useState(false);
  const [items] = useFilteredItems(params, level);
  const param = params.path || '';
  const cleanParam = param.split(' ').join('');
  const {
    actions,
    state: {
      dashboard: { allCollections, sandboxes, activeTeam },
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
    if (param) {
      setLevel(param ? param.split('/').length : 0);
      actions.dashboard.getSandboxesByPath(param);
    }
  }, [param, actions.dashboard, activeTeam]);

  const activeSandboxes = (sandboxes.ALL && sandboxes.ALL[cleanParam]) || [];

  const itemsToShow = allCollections
    ? [creating ? { type: 'folder', setCreating } : undefined, ...items].filter(
        exists => exists
      )
    : [{ type: 'skeletonRow' }, { type: 'skeletonRow' }];

  return (
    <SelectionProvider items={itemsToShow}>
      <Helmet>
        <title>{param || 'Dashboard'} - CodeSandbox</title>
      </Helmet>
      <Header
        path={param}
        templates={getPossibleTemplates(activeSandboxes)}
        createNewFolder={() => setCreating(true)}
        showViewOptions
        showFilters={param}
        showSortOptions={param}
      />
      <VariableGrid items={itemsToShow} />
    </SelectionProvider>
  );
};

export const All = withRouter(AllPage);
