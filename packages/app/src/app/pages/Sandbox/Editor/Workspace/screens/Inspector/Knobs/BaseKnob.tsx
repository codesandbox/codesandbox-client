import React from 'react';
import css from '@styled-system/css';
import { Input, Stack } from '@codesandbox/components';

interface BaseKnopProps {
  label: string;
}

const capitalize = (s: string) => {
  const [firstChar, ...rest] = s.split('');
  return [firstChar.toUpperCase(), ...rest].join('');
};

export const BaseKnob = (props: BaseKnopProps) => (
    <Stack align="center" css={css({ fontWeight: 500 })}>
      <div style={{ flexGrow: 1, width: '100%' }}>
        {capitalize(props.label)}
      </div>

      <Input css={css({ flexGrow: 2, width: '100%' })} />
    </Stack>
  );
