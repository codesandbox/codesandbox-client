import React from 'react';
import { EditorInspectorState } from 'inspector/lib/editor';
import { IComponentInstanceModel } from 'inspector/lib/editor/instance';
import { StaticComponentInformation } from 'inspector/lib/common/fibers';

export function useInspectorKnobs(inspectorStateService: EditorInspectorState) {
  const [
    selectedInstance,
    setSelectedInstance,
  ] = React.useState<IComponentInstanceModel | null>(null);

  const [
    componentInfo,
    setComponentInfo,
  ] = React.useState<StaticComponentInformation | null>(null);

  const handleSelectionChange = React.useCallback(
    (instance: IComponentInstanceModel) => {
      setSelectedInstance(instance);

      instance.getComponentInformation().then(info => {
        setComponentInfo(info);
      });
    },
    []
  );

  React.useEffect(() => {
    const selectedInstance = inspectorStateService.getSelectedInstance();
    if (selectedInstance) {
      handleSelectionChange(selectedInstance);
    }
  }, []);

  React.useEffect(() => {
    const listener = inspectorStateService.onSelectionChanged(instance => {
      handleSelectionChange(instance);
    });

    return () => {
      listener.dispose();
    };
  });

  return {
    selectedInstance,
    componentInfo,
  };
}
