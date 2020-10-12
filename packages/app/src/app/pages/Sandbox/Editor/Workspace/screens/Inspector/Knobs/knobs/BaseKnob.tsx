import React from 'react';
import css from '@styled-system/css';
import { Stack } from '@codesandbox/components';
import { IComponentInstanceModel } from 'inspector/lib/editor/instance';

import { useInspectorKnob } from '../../hooks/knob';
import { StaticPropInfo } from 'inspector/lib/common/fibers';
import { StringKnob } from './StringKnob';
import { DefaultKnob } from './DefaultKnob';
import { nicifyName } from '../utils/names';

interface BaseKnopProps {
  name: string;
  propInfo: StaticPropInfo;
  componentInstance: IComponentInstanceModel;
  disabled?: boolean;
}

export interface KnobProps {
  propInfo: StaticPropInfo;
  value: string;
  setValue: (code: string) => void;
}

export const BaseKnob = (props: BaseKnopProps) => {
  const { value, setValue } = useInspectorKnob(
    props.componentInstance,
    props.name
  );

  const UsedKnob =
    props.propInfo.typeInfo?.resolvedType === 'string'
      ? StringKnob
      : DefaultKnob;

  return (
    <Stack
      align="center"
      css={css({ fontWeight: 500, opacity: props.disabled ? 0.5 : 1 })}
    >
      <div style={{ flexGrow: 1, width: '100%' }}>{nicifyName(props.name)}</div>

      <div css={css({ flexGrow: 2, width: '100%' })}>
        {value !== null && (
          <UsedKnob
            value={value}
            setValue={setValue}
            propInfo={props.propInfo}
          />
        )}
      </div>
    </Stack>
  );
};
