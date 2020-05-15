import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element, Column } from '@codesandbox/components';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { getPossibleTemplates } from '../../utils';
import { SandboxGrid } from '../../../Components/SandboxGrid';
import { Sandbox } from '../../../Components/Sandbox';
import { Folder } from '../../../Components/Folder';
import { SkeletonCard } from '../../../Components/Sandbox/SandboxCard';

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

  // const createNewFolder = (name: string) => {
  //   setCreating(false);
  //   const newPath = params.path ? `/${param}/${name}` : `${param}/${name}`;
  //   actions.dashboard.createFolder(newPath);
  // };

  const getFoldersByPath =
    allCollections &&
    allCollections.filter(
      collection => collection.level === level && collection.parent === param
    );

  return (
    <Element style={{ height: '100%', position: 'relative' }}>
      <Header
        path={param}
        templates={getPossibleTemplates(allCollections)}
        createNewFolder={() => setCreating(true)}
      />
      {allCollections ? (
        <SandboxGrid>
          {creating && <Folder key="fake" />}
          {getFoldersByPath.map(folder => (
            <Folder key={folder.id} {...folder} />
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
