import { Column, Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { Folder } from '../../../Components/Folder';
import { Sandbox } from '../../../Components/Sandbox';
import { SkeletonCard } from '../../../Components/Sandbox/SandboxCard';
import { SandboxGrid } from '../../../Components/SandboxGrid';

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

  const getFoldersByPath =
    allCollections &&
    allCollections.filter(
      collection => collection.level === level && collection.parent === param
    );

  return (
    <Element style={{ height: '100%', position: 'relative' }}>
      <Header />
      {allCollections ? (
        <SandboxGrid>
          {creating && <Folder key="new" setCreating={setCreating} />}
          {getFoldersByPath.map(folder => (
            <Folder key={folder.id} {...folder} setCreating={setCreating} />
          ))}
          {sandboxes.ALL &&
            sandboxes.ALL[cleanParam] &&
            sandboxes.ALL[cleanParam].map(sandbox => (
              <Sandbox key={sandbox.id} sandbox={sandbox} />
            ))}
        </SandboxGrid>
      ) : (
        <SandboxGrid>
          {Array.from(Array(8).keys()).map(n => (
            <Column key={n}>
              <SkeletonCard />
            </Column>
          ))}
        </SandboxGrid>
      )}
    </Element>
  );
};

export const All = withRouter(AllPage);
