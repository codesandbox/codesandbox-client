import React, { useEffect } from 'react';
import { Collapsible } from '@codesandbox/components';
// import * as childProcess from 'node-services/lib/child_process';

import { EditorInspectorState } from 'inspector/lib/editor';

import { useOvermind } from 'app/overmind';
import { VSCodeEditorBridge } from './editor-bridge';
import { getInspectorStateService } from './inspector-singleton';
import { Knobs } from './Knobs';
import { FiberList } from './Fibers';

// childProcess.addForkHandler('ts-worker.ts', TSWorker);
// setTimeout(() => {
//   childProcess.fork('ts-worker.ts');
// }, 5000);

export const Inspector = () => {
  const { effects } = useOvermind();
  const [
    inspectorStateService,
    setInspectorStateService,
  ] = React.useState<EditorInspectorState | null>(null);

  useEffect(() => {
    const inspector = getInspectorStateService({
      vscodeEffect: effects.vscode,
    });

    setInspectorStateService(inspector);
    return () => {};
  }, []);

  if (!inspectorStateService) {
    return null;
  }

  return (
    <>
      <Collapsible defaultOpen title="App Structure">
        <FiberList inspectorStateService={inspectorStateService} />
      </Collapsible>

      <Knobs inspectorStateService={inspectorStateService} />
    </>
  );
};
