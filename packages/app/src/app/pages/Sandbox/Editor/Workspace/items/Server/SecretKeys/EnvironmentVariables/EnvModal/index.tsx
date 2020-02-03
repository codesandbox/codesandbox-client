import Input from '@codesandbox/common/lib/components/Input';
import { EnvironmentVariable } from '@codesandbox/common/lib/types';
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  MouseEvent,
  useState,
} from 'react';

import {
  ButtonsContainer,
  CancelButton,
  ErrorMessage,
  Form,
  InputContainer,
  NameInput,
  SaveButton,
} from './elements';

type Props = {
  name?: string;
  onCancel?: () => void;
  onSubmit: (variable: EnvironmentVariable) => void;
  value?: string;
};
export const EnvModal: FunctionComponent<Props> = ({
  name: nameProp = '',
  onCancel: onCancelProp,
  onSubmit: onSubmitProp,
  value: valueProp = '',
}) => {
  const [name, setName] = useState(nameProp);
  const [value, setValue] = useState(valueProp);

  const onCancel = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onCancelProp();
  };
  const onNameChange = ({
    target: { value: newName },
  }: ChangeEvent<HTMLInputElement>) => setName(newName);
  const onSubmit = (event: FormEvent<HTMLFormElement> | MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    onSubmitProp({ name, value });

    setName('');
    setValue('');
  };
  const onValueChange = ({
    target: { value: newValue },
  }: ChangeEvent<HTMLInputElement>) => setValue(newValue);

  const errorMessage = /\s/.test(name)
    ? "The name and the value can't contain spaces."
    : '';
  return (
    <Form onSubmit={onSubmit}>
      <div>
        <InputContainer>
          <NameInput onChange={onNameChange} placeholder="Name" value={name} />

          <Input onChange={onValueChange} placeholder="Value" value={value} />
        </InputContainer>
      </div>

      <ButtonsContainer>
        {onCancelProp && <CancelButton onClick={onCancel}>Cancel</CancelButton>}

        <SaveButton
          cancelButtonPresent={Boolean(onCancelProp)}
          disabled={!name || !value || Boolean(errorMessage)}
          onClick={onSubmit}
        >
          Save Secret
        </SaveButton>
      </ButtonsContainer>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Form>
  );
};
