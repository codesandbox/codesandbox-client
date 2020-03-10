import {
  Button,
  Element,
  FormField,
  Input,
  Stack,
} from '@codesandbox/components';
import React, {
  FormEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';

const noop = () => undefined;

type Props = {
  name?: string;
  onCancel?: () => void;
  onSubmit: (args: { name: string; value: string }) => void;
  value?: string;
};
export const VarForm: FunctionComponent<Props> = ({
  name: nameProp = '',
  onCancel: onCancelProp = noop,
  onSubmit: onSubmitProp,
  value: valueProp = '',
}) => {
  const [name, setName] = useState(nameProp);
  const [value, setValue] = useState(valueProp);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name && value) {
      onSubmitProp({ name, value });
      setName('');
      setValue('');
    }
  };

  const onCancel = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    if (key === 'Escape') {
      onCancelProp();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Element marginTop={4}>
        <FormField
          direction="vertical"
          hideLabel
          label="Environment Variable Name"
        >
          <Input
            onChange={({ target }) => setName(target.value)}
            onKeyDown={onCancel}
            placeholder="Name"
            required
            value={name}
          />
        </FormField>
      </Element>

      <FormField
        direction="vertical"
        hideLabel
        label="Environment Variable Value"
      >
        <Input
          onChange={({ target }) => setValue(target.value)}
          onKeyDown={onCancel}
          placeholder="Value"
          required
          value={value}
        />
      </FormField>

      <Stack paddingX={2} marginTop={2}>
        {nameProp && valueProp ? (
          <Button css={{ flex: 1 }} onClick={onCancelProp} variant="link">
            Cancel
          </Button>
        ) : null}

        <Button
          css={{ flex: 1 }}
          disabled={!name || !value}
          type="submit"
          variant="secondary"
        >
          {nameProp && valueProp ? 'Save' : 'Add Secret'}
        </Button>
      </Stack>
    </form>
  );
};
