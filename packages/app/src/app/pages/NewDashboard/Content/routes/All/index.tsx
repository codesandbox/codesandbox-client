import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import {
  SandboxGrid,
  SkeletonGrid,
} from 'app/pages/NewDashboard/Components/SandboxGrid';
import { getPossibleTemplates } from '../../utils';

export const AllPage = ({ match: { params }, history }) => {
  const [level, setLevel] = useState(0);
  const [creating, setCreating] = useState(false);
  const param = params.path || '';
  const cleanParam = param.split(' ').join('');
  const {
    actions,
    state: {
      dashboard: { allCollections, sandboxes, activeTeam },
    },
  } = useOvermind();
  const [localTeam, setLocalTeam] = useState(activeTeam);

  useEffect(() => {
    actions.dashboard.getAllFolders();
  }, [actions.dashboard, activeTeam]);

  useEffect(() => {
    if (localTeam !== activeTeam) {
      setLocalTeam(activeTeam);

      if (params) {
        history.push('/new-dashboard/all/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeam]);

  useEffect(() => {
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

  let items = [];
  if (creating) items.push({ type: 'folder', setCreating });

  items = [
    ...items,
    ...folders.map(folder => ({ type: 'folder', ...folder })),
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
      />
      {allCollections ? (
        <SandboxGrid items={items} />
      ) : (
        <SkeletonGrid count={8} />
      )}
    </SelectionProvider>
  );
};

export const All = withRouter(AllPage);
