import React from 'react';
import { EditorInspectorState } from 'inspector/lib/editor';
import { IComponentInstanceModel } from 'inspector/lib/editor/instance';
import {
  ComponentInstanceData,
  StaticComponentInformation,
} from 'inspector/lib/common/fibers';
import { IDisposable } from 'inspector/lib/common/rpc/disposable';

export function useInspectorKnobs(inspectorStateService: EditorInspectorState) {
  const [
    selectedInstance,
    setSelectedInstance,
  ] = React.useState<IComponentInstanceModel | null>(null);

  const [selectedProps, setSelectedProps] = React.useState<
    ComponentInstanceData['props'] | null
  >(null);

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
    const selInstance = inspectorStateService.getSelectedInstance();
    if (selInstance) {
      handleSelectionChange(selInstance);
    }
  }, [handleSelectionChange, inspectorStateService]);

  React.useEffect(() => {
    const listener = inspectorStateService.onSelectionChanged(instance => {
      handleSelectionChange(instance);
    });

    return () => {
      listener.dispose();
    };
  });

  React.useEffect(() => {
    let listener: IDisposable | null = null;
    if (selectedInstance) {
      setSelectedProps(selectedInstance.getInstanceInformation().props);
      listener = selectedInstance.didInstanceDataChange(event => {
        setSelectedProps(event.instanceData.props);
      });
    }

    return () => {
      if (listener) {
        listener.dispose();
      }
    };
  }, [selectedInstance]);

  return {
    selectedInstance,
    selectedProps,
    componentInfo,
  };
}
