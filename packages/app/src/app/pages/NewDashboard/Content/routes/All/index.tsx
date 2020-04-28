import React, { useEffect, useState } from 'react';
import { Element, Grid } from '@codesandbox/components';

import css from '@styled-system/css';
import { withRouter } from 'react-router-dom';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { useOvermind } from 'app/overmind';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { getPossibleTemplates } from '../../utils';
import { Sandbox } from '../../../Components/Sandbox';
import { FolderCard } from '../../../Components/FolderCard';

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
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,0.2fr))',
          })}
        >
          {getFoldersByPath.map(folder => (
            <FolderCard key={folder.id} {...folder} />
          ))}
          {sandboxes.ALL &&
            sandboxes.ALL[cleanParam] &&
            sandboxes.ALL[cleanParam].map(sandbox => (
              <Sandbox key={sandbox.id} sandbox={sandbox} />
            ))}
        </Grid>
      ) : (
        <Loading />
      )}
    </Element>
  );
};

export const All = withRouter(AllPage);
