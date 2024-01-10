import React, { useState } from 'react';
import { Radio } from '.';

export default {
  title: 'components/Radio',
  component: Radio,
};

export const Basic = () => (
  <>
    {/* eslint-disable-next-line no-console */}
    <Radio label="A Radio" onChange={e => console.log(e.target.checked)} />
    <div style={{ marginTop: 20 }}>
      {/* eslint-disable-next-line no-console */}
      <Radio label="A Radio" onChange={e => console.log(e.target.checked)} />
    </div>
  </>
);
export const Checked = () => {
  const [checked, setChecked] = useState(true);
  return (
    <>
      <Radio
        checked={checked}
        onChange={e => setChecked(e.target.checked)}
        label="Option one"
      />
      <Radio
        checked={checked}
        onChange={e => setChecked(e.target.checked)}
        label="A Radio"
      />
    </>
  );
};
