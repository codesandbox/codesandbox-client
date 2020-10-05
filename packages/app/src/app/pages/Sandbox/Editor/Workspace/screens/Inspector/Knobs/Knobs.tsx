import React from 'react';
import { Stack, Text } from '@codesandbox/components';
import { EditorInspectorState } from 'inspector/lib/editor';
import { useInspectorKnobs } from '../hooks/knobs';
import { BaseKnob } from './knobs/index';

type KnobsProps = {
  inspectorStateService: EditorInspectorState;
};

export const Knobs = ({ inspectorStateService }: KnobsProps) => {
  const { selectedInstance, selectedProps, componentInfo } = useInspectorKnobs(
    inspectorStateService
  );

  if (!selectedInstance) {
    return null;
  }

  const { name } = selectedInstance.getInstanceInformation();

  return (
    <Stack gap={2} direction="vertical" padding={3} style={{ marginTop: -16 }}>
      <Text weight="bold" color="white">
        {name || 'Anonymous'}
      </Text>

      {componentInfo &&
        selectedProps &&
        componentInfo.props.map(propsSourceInformation => {
          const instancePropInfo = selectedProps[propsSourceInformation.name];
          return (
            <BaseKnob
              disabled={!instancePropInfo}
              key={propsSourceInformation.name}
              name={propsSourceInformation.name}
              componentInstance={selectedInstance}
            />
          );
        })}
    </Stack>
  );
};
