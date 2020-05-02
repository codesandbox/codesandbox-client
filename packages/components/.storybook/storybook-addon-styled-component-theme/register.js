import addons from '@storybook/addons';
import React from 'react';

import { Themes } from './Themes';

addons.register('storybook/themes', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('storybook/themes/panel', {
    title: 'Themes',
    render: ({ active }) => (
      <Themes
        key="storybook-theme-addon"
        channel={addons.getChannel()}
        api={api}
        active={active}
      />
    ),
  });
});
