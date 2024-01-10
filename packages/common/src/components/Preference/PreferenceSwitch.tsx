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

  return (
    <div style={{ marginRight: 8 }}>
      <Switch onChange={handleClick} on={value} />
    </div>
  );
};
