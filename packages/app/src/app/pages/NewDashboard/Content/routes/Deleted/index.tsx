import React, { useEffect } from 'react';
import { Element, Text } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { Sandbox } from 'app/pages/NewDashboard/Components/Sandbox';
import { Loading } from 'app/pages/NewDashboard/Components/Loading';
import { sandboxesTypes } from 'app/overmind/namespaces/dashboard/state';
import { Header } from 'app/pages/NewDashboard/Components/Header';

export const Deleted = () => {
  const {
    actions,
    state: {
      dashboard: { deletedSandboxesByTime, sandboxes },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getPage(sandboxesTypes.DELETED);
  }, [actions.dashboard]);

  return (
    <Element style={{ position: 'relative' }}>
      <Header title="Recently Deleted" />
      {sandboxes.DELETED ? (
        <>
          {deletedSandboxesByTime.week.length ? (
            <Element marginBottom={14}>
              <Text marginBottom={6} block>
                Archived this week
              </Text>
              {deletedSandboxesByTime.week.map(sandbox => (
                <Sandbox sandbox={sandbox} key={sandbox.id} />
              ))}
            </Element>
          ) : null}
          {deletedSandboxesByTime.older.length ? (
            <>
              <Text marginBottom={6} block>
                Archived Earlier
              </Text>
              {deletedSandboxesByTime.older.map(sandbox => (
                <Sandbox sandbox={sandbox} key={sandbox.id} />
              ))}
            </>
          ) : null}
        </>
      ) : (
        <Loading />
      )}
    </Element>
  );
};
