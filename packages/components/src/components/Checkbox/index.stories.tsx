import React, { useState } from 'react';
import { Checkbox } from '.';

export default {
  title: 'components/Checkbox',
  component: Checkbox,
};

export const Basic = () => (
  // eslint-disable-next-line no-console
  <Checkbox label="A checkbox" onChange={e => console.log(e.target.checked)} />
);
export const Checked = () => {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      checked={checked}
      onChange={e => setChecked(e.target.checked)}
      label="A checkbox"
    />
  );
};
