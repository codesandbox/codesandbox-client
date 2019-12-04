import {
  ChangeEvent,
  ComponentProps,
  createElement,
  FunctionComponent,
} from 'react';

import { Input, TextArea } from './elements';

type Props = {
  block?: boolean;
  isTextArea?: boolean;
  placeholder?: string;
  rows?: number;
  setValue: (value: string) => void;
  value: string;
} & Pick<ComponentProps<typeof Input>, 'style'>;
export const PreferenceText: FunctionComponent<Props> = ({
  isTextArea,
  placeholder,
  setValue,
  value,
  ...props
}) => {
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setValue(target.value);
  };

  return createElement(isTextArea ? TextArea : Input, {
    onChange: handleChange,
    placeholder,
    value,
    ...props,
  });
};
