import React, { FunctionComponent } from 'react';

import Switch from '../Switch';

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
    <Switch
      offMode
      onClick={handleClick}
      right={value}
      secondary
      small
      style={{ width: '3rem' }}
    />
  );
};
