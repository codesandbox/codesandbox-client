import React from 'react';

import { Dialog } from '.';
import { Stack, Text, Select } from '../..';

export default {
  title: 'components/Dialog',
  component: Dialog,
};

export const Small = () => (
  <Stack justify="center" align="center" paddingX={2}>
    <Stack align="center" gap={1}>
      <Text size={3} variant="muted">
        My Sandboxes
      </Text>
      <Text size={3} variant="muted">
        /
      </Text>
      <Text size={3}>nifty-mccarthy-s5ny3</Text>
      <Dialog label="Adjust privacy settings">
        <Dialog.IconButton name="caret" size={2} />
        <Dialog.Content>
          <Stack direction="vertical" gap={4} padding={4}>
            <Text size={3} block>
              Adjust privacy settings.
            </Text>
            <Select>
              <option>Public</option>
              <option>Unlisted</option>
              <option>Private</option>
            </Select>
            <Text size={2} variant="muted">
              Everyone can see this Sandbox.
            </Text>
          </Stack>
        </Dialog.Content>
      </Dialog>
    </Stack>
  </Stack>
);
