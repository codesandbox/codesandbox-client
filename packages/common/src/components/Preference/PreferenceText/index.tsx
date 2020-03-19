import { ChangeEvent, createElement, FunctionComponent } from 'react';

import { Input, Textarea } from '@codesandbox/components';

type Props = {
  block?: boolean;
  isTextArea?: boolean;
  placeholder?: string;
  rows?: number;
  setValue: (value: string) => void;
  value: string;
  style?: any;
};

export const PreferenceText: FunctionComponent<Props> = ({
  isTextArea,
  placeholder,
  setValue,
  value,
  ...props
}) => {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  return createElement(isTextArea ? Textarea : Input, {
    onChange: handleChange,
    placeholder,
    value,
    ...props,
  });
};
