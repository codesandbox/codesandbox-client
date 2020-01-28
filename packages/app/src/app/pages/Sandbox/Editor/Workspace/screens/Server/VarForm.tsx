import React, { useState } from 'react';

import {
  Element,
  FormField,
  Input,
  Button,
  Stack,
} from '@codesandbox/components';

export const VarForm = props => {
  const [name, setName] = useState(props.name || '');
  const [value, setValue] = useState(props.value || '');

  const submit = e => {
    e.preventDefault();

    if (name && value) {
      props.onSubmit({
        name,
        value,
      });
      setName('');
      setValue('');
    }
  };

  const onCancel = e => {
    if (e.key === 'Escape' && props.onCancel) {
      props.onCancel();
    }
  };

  return (
    <form onSubmit={submit}>
      <Element marginTop={4}>
        <FormField
          direction="vertical"
          label="Environment Variable Name"
          hideLabel
        >
          <Input
            value={name}
            onKeyDown={onCancel}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Name"
          />
        </FormField>
      </Element>
      <FormField
        direction="vertical"
        label="Environment Variable Value"
        hideLabel
      >
        <Input
          value={value}
          onKeyDown={onCancel}
          onChange={e => setValue(e.target.value)}
          required
          placeholder="Value"
        />
      </FormField>
      <Stack paddingX={2} marginTop={2}>
        {props.name && props.value ? (
          <Button variant="link" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button variant="secondary">
          {props.name && props.value ? 'Save' : 'Add Secret'}
        </Button>
      </Stack>
    </form>
  );
};
