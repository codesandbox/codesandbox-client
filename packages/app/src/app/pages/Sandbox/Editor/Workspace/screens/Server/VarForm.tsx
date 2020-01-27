import React, { useState } from 'react';

import { Element, FormField, Input } from '@codesandbox/components';

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
      <input id="submit" type="submit" style={{ display: 'none' }} />
    </form>
  );
};
