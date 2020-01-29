import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  FunctionComponent,
} from 'react';

import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { FormField, Input, Stack } from '@codesandbox/components';

function select(el) {
  if (el) {
    el.select();
  }
}

interface Props {
  title: string;
  onCommit: (value: string, force?: boolean) => void;
  onChange: (value: string) => void;
  onCancel: () => void;
  error: string | false | null;
  id: string;
}

export const EntryTitleInput: FunctionComponent<Props> = ({
  title,
  onCommit,
  onCancel,
  onChange,
  error,
  id,
}) => {
  const [currentValue, setCurretValue] = useState(title);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      const { value } = e.target;
      onChange(value);
      setCurretValue(value);
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === ENTER) {
      onCommit(currentValue.trim());
    } else if (e.keyCode === ESC) {
      onCancel();
    }
  };

  return (
    <Stack direction="vertical" gap={1}>
      <FormField
        label={title ? `rename ${title}` : 'set name new file'}
        hideLabel
        css={{ height: '100%', padding: 0 }}
        id={`input-${id}`}
      >
        {/*
        // @ts-ignore */}
        <Input
          onChange={handleChange}
          onBlur={() => onCommit(currentValue, true)}
          onKeyUp={handleKeyUp}
          ref={select}
          value={currentValue}
          autoComplete="off"
          spellCheck="false"
          aria-invalid={Boolean(error)}
          aria-errormessage={`error-${id}`}
        />
      </FormField>
    </Stack>
  );
};
