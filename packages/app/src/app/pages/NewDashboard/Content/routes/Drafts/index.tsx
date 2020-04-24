import React, { useEffect } from 'react';
import { Element } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { AutoSizer, List } from 'react-virtualized';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { getPossibleTemplates } from '../../utils';
import { SandboxCard } from '../../../Components/SandboxCard';

export const Drafts = () => {
  const {
    actions,
    state: {
      dashboard: { draftSandboxes, getFilteredSandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getDrafts();
  }, [actions.dashboard]);

  function rowRenderer({ key, index, style }) {
    return <SandboxCard sandbox={filtered[index]} key={key} style={style} />;
  }

  const filtered = draftSandboxes ? getFilteredSandboxes(draftSandboxes) : [];
  const possibleTemplates = draftSandboxes
    ? getPossibleTemplates(draftSandboxes)
    : [];

  return (
    <Element style={{ height: '100%', position: 'relative' }}>
      <Header path="Drafts" templates={possibleTemplates} />
      {draftSandboxes ? (
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={filtered.length}
              rowHeight={240}
              rowRenderer={rowRenderer}
            />
          )}
        </AutoSizer>
      ) : (
        <Loading />
      )}
    </Element>
  );
};
