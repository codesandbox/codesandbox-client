import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element, Column } from '@codesandbox/components';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { SelectionProvider } from 'app/pages/NewDashboard/Components/Selection';
import { SandboxGrid } from 'app/pages/NewDashboard/Components/SandboxGrid';
import { Sandbox } from 'app/pages/NewDashboard/Components/Sandbox';
import { Folder } from 'app/pages/NewDashboard/Components/Folder';
import { SkeletonCard } from 'app/pages/NewDashboard/Components/Sandbox/SandboxCard';
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

  const folders =
    allCollections &&
    allCollections.filter(
      collection => collection.level === level && collection.parent === param
    );

  return (
    <SelectionProvider
      sandboxes={(sandboxes.ALL && sandboxes.ALL[cleanParam]) || []}
      folders={folders || []}
    >
      <Element style={{ height: '100%', position: 'relative' }}>
        <Header
          path={param}
          templates={getPossibleTemplates(allCollections)}
          createNewFolder={() => setCreating(true)}
        />
        {allCollections ? (
          <SandboxGrid>
            {creating && <Folder key="new" setCreating={setCreating} />}
            {folders.map(folder => (
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
    </SelectionProvider>
  );
};

export const All = withRouter(AllPage);
