import React from 'react';
import { Element } from '../Element';
import { Stack } from '../Stack';
import { ComboButton } from './ComboButton';

export default {
  title: 'components/facelift/ComboButton',
  component: ComboButton,
};

export const BaseVariant = () => (
  <Element padding={4}>
    <Stack direction="vertical" gap={4}>
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
        Primary
      </ComboButton>
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
        variant="trial"
      >
        Trial
      </ComboButton>
    </Stack>
  </Element>
);
