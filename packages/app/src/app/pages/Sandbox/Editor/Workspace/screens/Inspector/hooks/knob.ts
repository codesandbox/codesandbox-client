import React from 'react';
import {
  IComponentInstanceModel,
  InstanceProp,
} from 'inspector/lib/editor/instance';

interface UseKnobReturn {
  value: string;
  setValue: (code: string) => void;
}

export function useInspectorKnob(
  componentInstance: IComponentInstanceModel,
  propName: string
): UseKnobReturn {
  const [instanceProp, setInstanceProp] = React.useState<InstanceProp>(
    componentInstance.getInstanceProp(propName)!
  );
  const [value, setValue] = React.useState<string | null>(
    instanceProp && instanceProp.getValue()
  );

  React.useEffect(() => {
    if (instanceProp.valueSubscription) {
      instanceProp.valueSubscription.onDidContentChange(event => {
        setValue(event.content);
      });
    }
  }, [instanceProp]);

  return {
    value,
    setValue: (code: string) => {
      instanceProp.valueSubscription.setContent(code);
      instanceProp.setFiberProp(JSON.parse(code));
    },
  };
}
