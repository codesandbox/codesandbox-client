import React from 'react';
import { Button, Stack, Text } from '@codesandbox/components';
import { EditorInspectorState } from 'inspector/lib/editor';
import { useInspectorKnobs } from '../hooks/knobs';
import { BaseKnob } from './knobs/index';
import { nicifyName } from './utils/names';
import { groupBy, sortBy } from 'lodash-es';
import css from '@styled-system/css';

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

  const { name } = selectedInstance.getInstanceInformation();

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
    <Stack gap={2} direction="vertical" paddingY={3} style={{ marginTop: -16 }}>
      <Text paddingX={3} weight="bold" color="white">
        {name || 'Anonymous'}
      </Text>

      <Stack paddingX={3} gap={3} direction="vertical">
        {sortBy(setProps, 'name').map(propsSourceInformation => {
          const instancePropInfo = selectedProps[propsSourceInformation.name]!;

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

      <hr
        css={css({ backgroundColor: 'sideBar.border' })}
        style={{
          width: '100%',
          height: '1px',
          border: 'none',
          outline: 'none',
        }}
      />

      <Stack paddingX={3} direction="vertical" gap={4}>
        <Text size={2} variant="muted">
          Unset Props
        </Text>
        {sortBy(unsetProps, 'name').map(propsSourceInformation => {
          return (
            <Stack align="center">
              <Text style={{ width: '100%' }} key={propsSourceInformation.name}>
                {nicifyName(propsSourceInformation.name)}
              </Text>
              <Text size={2} variant="muted" key={propsSourceInformation.name}>
                {nicifyName(propsSourceInformation.typeInfo?.type || 'unknown')}
              </Text>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
};
