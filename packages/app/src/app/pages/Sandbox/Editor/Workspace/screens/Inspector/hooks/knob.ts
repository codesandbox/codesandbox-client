import React from 'react';
import {
  IComponentInstanceModel,
  InstanceProp,
} from 'inspector/lib/editor/instance';
import { IDisposable } from 'inspector/lib/common/rpc/disposable';

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

  React.useEffect(() => {
    let disposables: IDisposable[] = [];
    if (instanceProp?.valueSubscription) {
      disposables.push(
        instanceProp.valueSubscription.onDidContentChange(event => {
          setValue(event.content);
        })
      );

      disposables.push(
        instanceProp.valueSubscription.onWillDispose(() => {
          setValue('');
        })
      );

      setValue(instanceProp.valueSubscription.getContent());
    } else {
      setValue('');
    }

    return () => {
      disposables.forEach(disposable => disposable.dispose());
    };
  }, [instanceProp, setValue]);

  return {
    value,
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
