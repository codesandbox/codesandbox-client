import React, { useState } from 'react';

import { Element, FormField, Input, Button } from '@codesandbox/components';

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

  const onKeyDown = e => {
    if (e.key === 'Escape' && props.onEscClicked) {
      props.onEscClicked();
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
            onKeyDown={onKeyDown}
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
          onKeyDown={onKeyDown}
          onChange={e => setValue(e.target.value)}
          required
          placeholder="Value"
        />
      </FormField>
      <Element paddingX={2} style={{ display: 'none' }}>
        <Button marginTop={2} variant="secondary">
          {props.name ? 'Edit' : 'Add'} Secret
        </Button>
      </Element>
    </form>
  );
};
