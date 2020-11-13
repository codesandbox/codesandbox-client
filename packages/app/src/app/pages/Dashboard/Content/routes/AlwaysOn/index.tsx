import React from 'react';
import { Helmet } from 'react-helmet';
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
      dashboard: { sandboxes, getFilteredSandboxes },
    },
  } = useOvermind();

  React.useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.ALWAYS_ON);
  }, [actions.dashboard, activeTeam]);

  const items: DashboardGridItem[] = sandboxes.ALWAYS_ON
    ? getFilteredSandboxes(sandboxes.ALWAYS_ON).map(sandbox => ({
        type: 'sandbox',
        sandbox,
      }))
    : [{ type: 'skeleton-row' }, { type: 'skeleton-row' }];

  const pageType: PageTypes = 'always-on';

  return (
    <SelectionProvider activeTeamId={activeTeam} page={pageType} items={items}>
      <Helmet>
        <title>Always On - CodeSandbox</title>
      </Helmet>
      <Header title="Always On" activeTeam={activeTeam} showViewOptions />
      <VariableGrid page={pageType} items={items} />
    </SelectionProvider>
  );
};
