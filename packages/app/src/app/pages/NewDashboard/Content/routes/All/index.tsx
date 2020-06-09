import React from 'react';
import { orderBy } from 'lodash-es';
import { withRouter } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import {
  VariableGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/VariableGrid';
import { getPossibleTemplates } from '../../utils';

export const AllPage = ({ match: { params }, history }) => {
  const [level, setLevel] = React.useState(0);
  const [creating, setCreating] = React.useState(false);
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

  const sandboxesForPath = (sandboxes.ALL && sandboxes.ALL[cleanParam]) || [];

  const folders =
    (allCollections &&
      allCollections.filter(
        collection => collection.level === level && collection.parent === param
      )) ||
    [];

  const sortedFolders = orderBy(folders, 'name').sort(
    a => (a.path === '/drafts' ? -1 : 1) // pull drafts to the top
  );

  let items = [];
  if (creating) items.push({ type: 'folder', setCreating });

  items = [
    ...items,
    ...sortedFolders.map(folder => ({ type: 'folder', ...folder })),
    ...sandboxesForPath.map(sandbox => ({ type: 'sandbox', ...sandbox })),
  ];

  return (
    <SelectionProvider
      sandboxes={(sandboxes.ALL && sandboxes.ALL[cleanParam]) || []}
      folders={folders || []}
    >
      <Header
        path={param}
        templates={getPossibleTemplates(allCollections)}
        createNewFolder={() => setCreating(true)}
        showViewOptions
        showFilters={param}
        showSortOptions={param}
      />
      {allCollections ? (
        <VariableGrid items={items} />
      ) : (
        <SkeletonGrid count={8} />
      )}
    </SelectionProvider>
  );
};

export const All = withRouter(AllPage);
