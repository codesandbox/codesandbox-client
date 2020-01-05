import React, {
  useState,
  ChangeEvent,
  KeyboardEvent,
  FunctionComponent,
} from 'react';
import { VisuallyHidden } from 'reakit/VisuallyHidden';

import { ESC, ENTER } from '@codesandbox/common/lib/utils/keycodes';

import { InputContainer, InputError } from './elements';

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
    <InputContainer>
      <VisuallyHidden>
        <label id={`label-${id}`} htmlFor={`input-${id}`}>
          {title ? `rename ${title}` : 'set name new file'}
        </label>
      </VisuallyHidden>
      <input
        onChange={handleChange}
        onBlur={() => onCommit(currentValue, true)}
        onKeyUp={handleKeyUp}
        ref={select}
        autoComplete="new-directory"
        value={currentValue}
        id={`input-${id}`}
        aria-invalid={Boolean(error)}
        aria-labelledby={`label-${id}`}
        aria-describedby={`error-${id}`}
      />
      {error && typeof error === 'string' && (
        <InputError role="alert" id={`error-${id}`}>
          {error}
        </InputError>
      )}
    </InputContainer>
  );
};
