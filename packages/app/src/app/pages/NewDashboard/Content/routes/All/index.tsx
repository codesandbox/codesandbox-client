import React, { useEffect, useState } from 'react';
import { Element, Text, Column, Grid, Link } from '@codesandbox/components';

import css from '@styled-system/css';
import { withRouter, Link as LinkBase } from 'react-router-dom';
import { Filters } from 'app/pages/NewDashboard/Components/Filters';
import { useOvermind } from 'app/overmind';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { getPossibleTemplates } from '../../utils';

import { SandboxCard } from '../../../Components/SandboxCard';

export const AllPage = ({ match: { params } }) => {
  const [level, setLevel] = useState(0);
  const param = params.path || '';
  const cleanParam = param.split(' ').join('');
  const {
    actions,
    state: {
      dashboard: { allCollections, sandboxesByPath },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getAllFolders();
  }, [actions.dashboard]);

  useEffect(() => {
    if (param) {
      setLevel(param ? param.split('/').length : 0);
      actions.dashboard.getSandboxesByPath(param);
    }
  }, [param, actions.dashboard]);

  const getFoldersByPath =
    allCollections &&
    allCollections.filter(
      collection => collection.level === level && collection.parent === param
    );

  const makeLink = p =>
    param && param.split('/').length > 2
      ? `/new-dashboard/all/${param
          .split('/')
          .slice(0, -1)
          .map(a => a)}` +
        '/' +
        p
      : `/new-dashboard/all/${p}`;

  const possibleTemplates = allCollections
    ? getPossibleTemplates(allCollections)
    : [];

  return (
    <Element style={{ height: '100%', position: 'relative' }}>
      <Text marginBottom={4} block>
        <Link to="/new-dashboard/all/" as={LinkBase}>
          All Sandboxes
        </Link>{' '}
        &gt;{' '}
        {param
          ? param.split('/').map(p => (
              <Link as={LinkBase} to={makeLink(p)}>
                {p} &gt;{' '}
              </Link>
            ))
          : null}
      </Text>
      <Filters possibleTemplates={possibleTemplates} />
      {allCollections ? (
        <Grid
          rowGap={6}
          columnGap={6}
          marginBottom={8}
          css={css({
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          })}
        >
          {getFoldersByPath.map(folder => (
            <Column key={folder.id}>
              <Link as={LinkBase} to={`/new-dashboard/all` + folder.path}>
                {folder.name}
              </Link>
            </Column>
          ))}
          {sandboxesByPath &&
            sandboxesByPath[cleanParam] &&
            sandboxesByPath[cleanParam].map(sandbox => (
              <Column key={sandbox.id}>
                <SandboxCard sandbox={sandbox} />
              </Column>
            ))}
        </Grid>
      ) : (
        <Loading />
      )}
    </Element>
  );
};

export const All = withRouter(AllPage);
