import React, { useState } from 'react';

import { Button } from '@codesandbox/common/lib/components/Button';
import { InputContainer, ErrorMessage, EnvName, EnvValue } from './elements';

export const EnvModal = props => {
  const [name, setName] = useState(props.name || '');
  const [value, setValue] = useState(props.value || '');

  const onNameChange = e => setName(e.target.value);
  const onValueChange = e => setValue(e.target.value);

  const onCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    props.onCancel();
  };

  const onSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    props.onSubmit({ name, value });

    setName('');
    setValue('');
  };

  const isValid = () => {
    if (/\s/.test(name)) {
      return "The name and the value can't contain spaces.";
    }

    return false;
  };

  const errorMessage = isValid();
  return (
    <form style={{ width: '100%' }} onSubmit={onSubmit}>
      <div>
        <InputContainer>
          <EnvName placeholder="Name" onChange={onNameChange} value={name} />
          <EnvValue
            placeholder="Value"
            onChange={onValueChange}
            value={value}
          />
        </InputContainer>
      </div>
      <div style={{ display: 'flex' }}>
        {props.onCancel && (
          <Button
            onClick={onCancel}
            style={{ flex: 1, marginRight: '.25rem' }}
            red
            small
          >
            Cancel
          </Button>
        )}

        <Button
          style={{ flex: 1, marginLeft: props.onCancel ? '.25rem' : 0 }}
          block
          disabled={!name || !value || errorMessage}
          small
        >
          Save Secret
        </Button>
      </div>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </form>
  );
};
