import React, { ChangeEvent, FunctionComponent } from 'react';

import { Select } from '@codesandbox/components';

type Props = {
  mapName?: (param: string) => string;
  options: string[];
  setValue: (value: string) => void;
  value: string;
};

export const PreferenceDropdown: FunctionComponent<Props> = ({
  mapName,
  options,
  setValue,
  value,
}) => {
  const handleChange = ({ target }: ChangeEvent<any>) => {
    setValue(target.value);
  };

  return (
    <Select onChange={handleChange} value={value}>
      {options.map(option => (
        <option key={option} value={option}>
          {mapName ? mapName(option) : option}
        </option>
      ))}
    </Select>
  );
};
