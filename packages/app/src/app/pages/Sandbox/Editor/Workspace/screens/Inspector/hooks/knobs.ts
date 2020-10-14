import React from 'react';
import { EditorInspectorState } from 'inspector/lib/editor';
import { IComponentInstanceModel } from 'inspector/lib/editor/instance';
import {
  ComponentInstanceData,
  StaticComponentInformation,
} from 'inspector/lib/common/fibers';
import { useDisposableEffect } from './useDisposableEffect';

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

  useDisposableEffect(toDispose => {
    toDispose.push(
      inspectorStateService.onSelectionChanged(instance => {
        handleSelectionChange(instance);
      })
    );
  }, []);

  useDisposableEffect(
    toDispose => {
      if (selectedInstance) {
        setSelectedProps(selectedInstance.getInstanceInformation().props);
        toDispose.push(
          selectedInstance.didInstanceDataChange(event => {
            setSelectedProps(event.instanceData.props);
          })
        );

        toDispose.push(
          selectedInstance.didComponentDataChange(event => {
            setComponentInfo(event.componentData);
          })
        );
      }
    },
    [selectedInstance]
  );

  return {
    selectedInstance,
    selectedProps,
    componentInfo,
  };
}
