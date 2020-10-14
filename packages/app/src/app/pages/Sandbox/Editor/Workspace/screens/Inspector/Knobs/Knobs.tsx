import React from 'react';
import { AnimateSharedLayout, motion } from 'framer-motion';
import { Collapsible, Stack } from '@codesandbox/components';
import { EditorInspectorState } from 'inspector/lib/editor';
import { useInspectorKnobs } from '../hooks/knobs';
import { BaseKnob } from './knobs/index';
import { groupBy, sortBy } from 'lodash-es';
import { UnusedKnob } from './knobs/UnusedKnob';

type KnobsProps = {
  inspectorStateService: EditorInspectorState;
};

export const Knobs = ({ inspectorStateService }: KnobsProps) => {
  const { selectedInstance, selectedProps, componentInfo } = useInspectorKnobs(
    inspectorStateService
  );

  if (!selectedInstance || !componentInfo || !selectedProps) {
    return null;
  }

  const name = selectedInstance.getName();
  const id = selectedInstance.getId();

  const { setProps = [], unsetProps = [] } = groupBy(
    componentInfo.props,
    prop => {
      if (selectedProps[prop.name]) {
        return 'setProps';
      } else {
        return 'unsetProps';
      }
    }
  );

  return (
    <Collapsible defaultOpen title={`Knobs (${name || 'Anonymous'})`}>
      <Stack
        gap={2}
        direction="vertical"
        paddingY={3}
        style={{ marginTop: -16 }}
      >
        <Stack paddingX={3} gap={2} direction="vertical">
          {sortBy(setProps, 'name').map(propsSourceInformation => {
            const instancePropInfo = selectedProps[
              propsSourceInformation.name
            ]!;

            return (
              <BaseKnob
                key={propsSourceInformation.name}
                disabled={!instancePropInfo}
                name={propsSourceInformation.name}
                propInfo={propsSourceInformation}
                componentInstance={selectedInstance}
              />
            );
          })}
        </Stack>

        <Stack paddingX={1} direction="vertical">
          {sortBy(unsetProps, 'name').map(propsSourceInformation => {
            return (
              <UnusedKnob
                key={propsSourceInformation.name}
                onClick={async () => {
                  await selectedInstance.addProp(propsSourceInformation.name);
                }}
                propName={propsSourceInformation.name || ''}
                propType={propsSourceInformation.typeInfo?.type || null}
              />
            );
          })}
        </Stack>
      </Stack>
    </Collapsible>
  );
};
