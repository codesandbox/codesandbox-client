import React, { FunctionComponent } from 'react';

import { Switch } from '@codesandbox/components';

type Props = {
  setValue: (value: boolean) => void;
  value: boolean;
};

export const PreferenceSwitch: FunctionComponent<Props> = ({
  setValue,
  value,
}) => {
  const handleClick = () => {
    setValue(!value);
  };

  return <Switch onChange={handleClick} on={value} />;
};
