import React from 'react';

import Preferences from './Preferences';
import Title, { Description } from '../MenuTitle';

export default () => (
  <div>
    <Title style={{ marginBottom: 1 }}>Key Bindings</Title>
    <Description>
      Record CodeSandbox specific keybindings here. You can cancel a recording
      by pressing ESCAPE, you can confirm by pressing ENTER and you can delete a
      mapping by pressing BACKSPACE.
      <p>
        The second input can be specified for a <em>sequence</em> of actions,
        like double tapping shift.
      </p>
    </Description>

    <Preferences />
  </div>
);
