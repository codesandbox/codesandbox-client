import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element, Column } from '@codesandbox/components';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { getPossibleTemplates } from '../../utils';
import { SandboxGrid } from '../../../Components/SandboxGrid';
import { Sandbox } from '../../../Components/Sandbox';
import { FolderCard } from '../../../Components/FolderCard';
import { SkeletonCard } from '../../../Components/SandboxCard';

export const AllPage = ({ match: { params }, history }) => {
  const [level, setLevel] = useState(0);
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
      <Header path={param} templates={getPossibleTemplates(allCollections)} />
      {allCollections ? (
        <SandboxGrid>
          {getFoldersByPath.map(folder => (
            <Column>
              <FolderCard key={folder.id} {...folder} />
            </Column>
          ))}
          {sandboxes.ALL &&
            sandboxes.ALL[cleanParam] &&
            sandboxes.ALL[cleanParam].map(sandbox => (
              <Column>
                <Sandbox key={sandbox.id} sandbox={sandbox} />
              </Column>
            ))}
        </SandboxGrid>
      ) : (
        <SandboxGrid>
          {Array.from(Array(4).keys()).map(n => (
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
