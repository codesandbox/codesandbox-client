import React, { useEffect } from 'react';
import { Collapsible } from '@codesandbox/components';

import { Fiber } from './Fiber';
import {
  getInspectorStateService,
  EditorInspectorState,
} from 'inspector/lib/editor';
import { Fiber as FiberType } from 'inspector/lib/common/fibers';

export const Inspector = () => {
  const inspectorStateService = React.useRef<EditorInspectorState>();
  const [fibers, setFibers] = React.useState<FiberType[]>([]);
  const [selectedFiber, setSelectedFiber] = React.useState<FiberType | null>(
    null
  );

  useEffect(() => {
    inspectorStateService.current = getInspectorStateService();
    inspectorStateService.current.getFibers().then(fibers => {
      setFibers(fibers);
    });
    inspectorStateService.current.onSelectionChanged(fiber => {
      setSelectedFiber(fiber);
    });
  }, []);

  return (
    <>
      <Collapsible defaultOpen title="App Structure">
        <div style={{ marginTop: -16 }}>
          {fibers.map(fiber => (
            <Fiber
              key={fiber.id}
              id={fiber.id}
              name={fiber.name || 'Anonymous'}
              depth={fiber.depth}
              onSelect={id => {
                inspectorStateService.current.selectFiber(id);
              }}
            />
          ))}
        </div>
      </Collapsible>
      <Collapsible defaultOpen title="Knobs">
        {selectedFiber && (
          <div style={{ marginTop: -16 }}>
            {selectedFiber.name || 'Anonymous'}
          </div>
        )}
      </Collapsible>
    </>
  );
};
