import React, { ChangeEvent, FunctionComponent } from 'react';

import { Input } from '@codesandbox/components';

type Props = {
  setValue: (value: number) => void;
  step?: number;
  value: number;
  style?: React.CSSProperties;
};

export const PreferenceNumber: FunctionComponent<Props> = ({
  setValue,
  step,
  style,
  value,
}) => {
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!Number.isNaN(+target.value)) {
      setValue(+target.value);
    }
  };

  return (
    <Input
      onChange={handleChange}
      step={step}
      style={{ width: '3rem', ...style }}
      type="number"
      value={value}
    />
  );
};
