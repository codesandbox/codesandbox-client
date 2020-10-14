import React from 'react';
import {
  IComponentInstanceModel,
  InstanceProp,
} from 'inspector/lib/editor/instance';
import { IDisposable } from 'inspector/lib/common/rpc/disposable';
import { useDisposableEffect } from './useDisposableEffect';

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
    instanceProp?.getValue() || null
  );

  React.useEffect(() => {
    setInstanceProp(componentInstance.getInstanceProp(propName)!);
  }, [propName, componentInstance]);

  useDisposableEffect(
    toDispose => {
      if (instanceProp?.valueSubscription) {
        toDispose.push(
          instanceProp.valueSubscription.onDidContentChange(event => {
            setValue(event.content);
          })
        );

        toDispose.push(
          instanceProp.valueSubscription.onWillDispose(() => {
            setValue('');
          })
        );

        setValue(instanceProp.valueSubscription.getContent());
      } else {
        setValue('');
      }
    },
    [instanceProp, setValue]
  );

  return {
    value: value,
    setValue: (code: string) => {
      let sourceCode = code;
      if (sourceCode[0] !== '"' && sourceCode[0] !== '{') {
        sourceCode = `{${sourceCode}}`;
      }
      instanceProp.valueSubscription.setContent(code);

      let cleanedProp = code;
      const isComputed = code[0] === '{' && code[code.length - 1] === '}';

      if (isComputed) {
        const splitCode = code.split('');
        splitCode.pop();
        splitCode.shift();
        cleanedProp = splitCode.join('');
      }

      instanceProp.setFiberProp(JSON.parse(cleanedProp));
    },
  };
}
