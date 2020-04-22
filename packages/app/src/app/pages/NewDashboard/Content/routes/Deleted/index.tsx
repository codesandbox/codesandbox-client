import React, { useEffect } from 'react';
import { Element, Text } from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import { SandboxCard } from '../../../Components/SandboxCard';

export const Deleted = () => {
  const {
    actions,
    state: {
      user,
      dashboard: { deletedSandboxesByTime, loadingPage },
    },
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getDeletedSandboxes();
  }, [actions.dashboard, user]);

  if (loadingPage) {
    return <Text>loading</Text>;
  }

  return (
    <Element>
      <Text marginBottom={2} block>
        Recently Deleted
      </Text>
      <Text variant="muted" block marginBottom={11}>
        Sandboxes, Templates and Folders are permanently deleted after 30 days{' '}
      </Text>
      {deletedSandboxesByTime.week.length && (
        <Element marginBottom={14}>
          <Text marginBottom={6} block>
            Archived this week
          </Text>
          {deletedSandboxesByTime.week.map(sandbox => (
            <SandboxCard sandbox={sandbox} key={sandbox.id} />
          ))}
        </Element>
      )}
      {deletedSandboxesByTime.older.length && (
        <>
          <Text marginBottom={6} block>
            Archived Earlier
          </Text>
          {deletedSandboxesByTime.older.map(sandbox => (
            <SandboxCard sandbox={sandbox} key={sandbox.id} />
          ))}
        </>
      )}
    </Element>
  );
};
