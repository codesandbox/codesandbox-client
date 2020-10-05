import React from 'react';
import { EditorInspectorState } from 'inspector/lib/editor';
import { Fiber } from 'inspector/lib/common/fibers';
import { IComponentInstanceModel } from 'inspector/lib/editor/instance';

export function useInspectorFibers(
  inspectorStateService: EditorInspectorState
) {
  const [fibers, setFibers] = React.useState<Fiber[]>([]);
  const [
    selectedInstance,
    setSelectedInstance,
  ] = React.useState<IComponentInstanceModel | null>(
    inspectorStateService.getSelectedInstance()
  );

  React.useEffect(() => {
    inspectorStateService.getFibers().then(setFibers);
    const selectedListener = inspectorStateService.onSelectionChanged(
      instance => {
        setSelectedInstance(instance);
      }
    );

    return () => {
      selectedListener.dispose();
    };
  }, [inspectorStateService]);

  const selectedFiber = React.useMemo(() => {
    if (!selectedInstance) {
      return null;
    }

    return inspectorStateService.getFiberFromInstance(selectedInstance);
  }, [selectedInstance, inspectorStateService]);

  return { fibers, selectedFiber };
}
