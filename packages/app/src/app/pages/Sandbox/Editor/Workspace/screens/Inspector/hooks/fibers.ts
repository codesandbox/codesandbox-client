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
  const selectFiber = (id: string) => {
    inspectorStateService.selectFiber(id);
  };

  React.useEffect(() => {
    inspectorStateService.getFibers().then(fibers => {
      setFibers(fibers);
    });
    const selectedListener = inspectorStateService.onSelectionChanged(
      instance => {
        setSelectedInstance(instance);
      }
    );

    return () => {
      selectedListener.dispose();
    };
  }, []);

  const selectedFiber = React.useMemo(() => {
    if (!selectedInstance) {
      return null;
    }

    return inspectorStateService.getFiberFromInstance(selectedInstance);
  }, [selectedInstance]);

  return { fibers, selectedFiber };
}
