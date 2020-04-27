import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { getPossibleTemplates } from '../../utils';

import { SandboxesGroup } from './SandboxesGroup';

export const Recent = () => {
  const {
    actions,
    state: {
      dashboard: { sandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.RECENT);
  }, [actions.dashboard]);

  const possibleTemplates = sandboxes.RECENT
    ? getPossibleTemplates(sandboxes.RECENT)
    : [];

  return (
    <>
      <Header
        title="Recently Modified Sandboxes"
        templates={possibleTemplates}
      />
      <section style={{ position: 'relative' }}>
        {sandboxes.RECENT ? (
          <>
            <SandboxesGroup title="Today" time="day" />
            <SandboxesGroup title="Last 7 Days" time="week" />
            <SandboxesGroup title="Earlier this month" time="month" />
            <SandboxesGroup title="Older" time="older" />
          </>
        ) : (
          <Loading />
        )}
      </section>
    </>
  );
};
