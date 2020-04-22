import React, { useEffect } from 'react';
import { Element, Text } from '@codesandbox/components';

import { Filters } from 'app/pages/NewDashboard/Components/Filters';
import { useOvermind } from 'app/overmind';
import { AutoSizer, List } from 'react-virtualized';
import { getPossibleTemplates } from '../../utils';
import { SandboxCard } from '../../../Components/SandboxCard';

export const Drafts = () => {
  const {
    actions,
    state: {
      user,
      dashboard: {
        draftSandboxes,
        getFilteredSandboxes,
        loadingPage,
        activeTeam,
      },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getDrafts();
  }, [actions.dashboard, user, activeTeam]);

  if (loadingPage) {
    return <Text>loading</Text>;
  }

  const filtered = getFilteredSandboxes(draftSandboxes);

  function rowRenderer({ key, index, style }) {
    return <SandboxCard sandbox={filtered[index]} key={key} style={style} />;
  }

  return (
    <Element style={{ height: '100%' }}>
      <Text marginBottom={4} block>
        Drafts
      </Text>
      <Filters possibleTemplates={getPossibleTemplates(draftSandboxes)} />
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
      ,
    </Element>
  );
};
