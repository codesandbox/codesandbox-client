import addons from '@storybook/addons';
import React from 'react';

import { Themes } from './Themes';

addons.register('storybook/themes', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('storybook/themes/panel', {
    title: 'Themes',
    render: ({ active }) => (
      <Themes
        active={active}
        api={api}
        channel={addons.getChannel()}
        key="storybook-theme-addon"
      />
    ),
  });
});
