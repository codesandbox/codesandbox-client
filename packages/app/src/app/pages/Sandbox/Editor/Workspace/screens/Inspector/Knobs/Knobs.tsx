import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import { EditorInspectorState } from 'inspector/lib/editor';
import { useInspectorKnobs } from '../hooks/knobs';
import { BaseKnob } from './knobs/index';

type KnobsProps = {
  inspectorStateService: EditorInspectorState;
};

export const Knobs = ({ inspectorStateService }: KnobsProps) => {
  const { selectedInstance, componentInfo } = useInspectorKnobs(
    inspectorStateService
  );

  if (!selectedInstance) {
    return null;
  }

  const { name, props } = selectedInstance.getInstanceInformation();

  return (
    <Stack gap={2} direction="vertical" padding={3} style={{ marginTop: -16 }}>
      <Text weight="bold" color="white">
        {name || 'Anonymous'}
      </Text>

      {componentInfo &&
        componentInfo.props.map(propsSourceInformation => {
          const instancePropInfo = selectedInstance.getInstanceInformation()
            .props[propsSourceInformation.name];
          return (
            <BaseKnob
              onClick={() => {
                if (instancePropInfo) {
                  // const range = componentRangeToViewRange(
                  //   instancePropInfo.valuePosition
                  // );
                  // effects.vscode.highlightRange(
                  //   selectedInstance.location.path,
                  //   range,
                  //   '#6CC7F650',
                  //   'inspector-value'
                  // );
                  // console.log(
                  //   effects.vscode.subscribeToSpan(
                  //     selectedInstance.location.path,
                  //     range
                  //   )
                  // );
                }
              }}
              disabled={!instancePropInfo}
              key={propsSourceInformation.name}
              label={propsSourceInformation.name}
            />
          );
        })}
    </Stack>
  );
};
