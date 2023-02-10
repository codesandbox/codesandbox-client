import React from 'react';
import { ComboButton } from './ComboButton';

export default {
  title: 'components/facelift/ComboButton',
  component: ComboButton,
};

export const BaseVariant = () => (
  <ComboButton
    onClick={() => alert('onClick')}
    options={
      <>
        <ComboButton.Item onSelect={() => {}} disabled>
          Disabled button
        </ComboButton.Item>
        <ComboButton.Item onSelect={() => alert('onSelect')}>
          Enabled button
        </ComboButton.Item>
      </>
    }
  >
    Hello
  </ComboButton>
);
