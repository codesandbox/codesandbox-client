import React from 'react';
import css from '@styled-system/css';
import { Input, Stack } from '@codesandbox/components';
import { IComponentInstanceModel } from 'inspector/lib/editor/instance';

import { useInspectorKnob } from '../../hooks/knob';

interface BaseKnopProps {
  name: string;
  componentInstance: IComponentInstanceModel;
  disabled?: boolean;
}

const nicify = (s: string) => {
  const [firstChar, ...rest] = s.split('');

  return [firstChar.toUpperCase(), ...rest]
    .join('')
    .split(/(?=[A-Z])/g)
    .join(' ');
};

export const BaseKnob = (props: BaseKnopProps) => {
  const { value, setValue } = useInspectorKnob(
    props.componentInstance,
    props.name
  );

  return (
    <Stack
      align="center"
      css={css({ fontWeight: 500, opacity: props.disabled ? 0.5 : 1 })}
    >
      <div style={{ flexGrow: 1, width: '100%' }}>{nicify(props.name)}</div>

      <Input
        onChange={e => {
          setValue(e.target.value);
        }}
        value={value}
        css={css({ flexGrow: 2, width: '100%' })}
      />
    </Stack>
  );
};
