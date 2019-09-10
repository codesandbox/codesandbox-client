import React from 'react';
import { Tabs, Tab, Close } from './elements';

/**
  Because we have two themes, we need to
  segregate application of styles.

  We wrap the Container with a ThemeProvider.

  TODO: Find a better way of doing this, we're
  going to have 2 themes for quite some time
  until we finish the redesign. Wrapping each element/section
  would probably get difficult to maintain
*/
import { ThemeProvider } from '../nu-theme/provider';

export function FileTabs({ files, ...props }) {
  return (
    <ThemeProvider>
      <Tabs {...props}>
        {files.map(file => (
          <Tab key={file.id} aria-selected={file.selected}>
            {file.name} <Close />
          </Tab>
        ))}
      </Tabs>
    </ThemeProvider>
  );
}
