import React from 'react';
import { Helmet } from 'react-helmet';
import { Button, Text } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/types';
import { Header } from 'app/pages/Dashboard/Components/Header';
import { VariableGrid } from 'app/pages/Dashboard/Components/VariableGrid';
import { SelectionProvider } from 'app/pages/Dashboard/Components/Selection';
import { DashboardGridItem, PageTypes } from 'app/pages/Dashboard/types';

export const AlwaysOn = () => {
  const {
    actions,
    state: {
      activeTeam,
      dashboard: { sandboxes },
    },
  } = useOvermind();

  React.useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.ALWAYS_ON);
  }, [actions.dashboard, activeTeam]);

  const items: DashboardGridItem[] = sandboxes.ALWAYS_ON
    ? sandboxes.ALWAYS_ON.map(sandbox => ({
        type: 'sandbox',
        sandbox,
        noDrag: true,
      }))
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'always-on';

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Always-On - CodeSandbox</title>
      </Helmet>
      <Header title="Always-On" activeTeam={activeTeam} showViewOptions />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};

const EmptyScreen = () => {
  const { actions } = useOvermind();

  return (
    <Text variant="muted">
      Pilot users can make up to 3 server sandboxes always-on. <br />
      <Button
        as={Text}
        variant="link"
        onClick={() =>
          actions.modalOpened({
            modal: 'feedback',
            message: "I'd like more Always-On sandboxes",
          })
        }
      >
        Contact us
      </Button>
      if you need more Always on Sandboxes
    </Text>
  );
};
