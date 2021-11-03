import React from 'react';
import { useEffects } from 'app/overmind';
import { EditorInspectorState } from 'inspector/lib/editor';
import { Fiber } from '../Fiber';
import { useInspectorFibers } from '../hooks/fibers';
import { componentRangeToViewRange } from '../utils';

type FiberListProps = {
  inspectorStateService: EditorInspectorState;
};

export const FiberList = ({ inspectorStateService }: FiberListProps) => {
  const { fibers, selectedFiber } = useInspectorFibers(inspectorStateService);
  const effects = useEffects();

  return (
    <div style={{ marginTop: -16 }}>
      {fibers.map(fiber => (
        <Fiber
          key={fiber.id}
          id={fiber.id}
          name={fiber.name || 'Anonymous'}
          depth={fiber.depth}
          selected={selectedFiber && selectedFiber.id === fiber.id}
          onSelect={id => {
            inspectorStateService.selectFiber(id);
          }}
          onMouseEnter={id => {
            inspectorStateService.highlightFiber(id);

            effects.vscode.highlightRange(
              fiber.location.path.replace('/sandbox', ''),
              componentRangeToViewRange(fiber.location.codePosition),
              '#6CC7F650',
              'inspector'
            );
          }}
          onMouseLeave={id => {
            inspectorStateService.stopHighlightFiber(id);

            effects.vscode.clearHighlightedRange(
              fiber.location.path.replace('/sandbox', ''),
              'inspector'
            );
          }}
        />
      ))}
    </div>
  );
};
