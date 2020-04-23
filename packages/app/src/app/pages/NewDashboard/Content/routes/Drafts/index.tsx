import React, { useEffect } from 'react';
import { Element, Text } from '@codesandbox/components';

import { Filters } from 'app/pages/NewDashboard/Components/Filters';
import { useOvermind } from 'app/overmind';
import { AutoSizer, List } from 'react-virtualized';
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
      <Text marginBottom={4} block>
        Drafts
      </Text>
      <Filters possibleTemplates={possibleTemplates} />
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
