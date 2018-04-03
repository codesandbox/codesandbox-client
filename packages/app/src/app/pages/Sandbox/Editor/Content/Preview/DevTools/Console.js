import React from 'react';
import Console from 'app/components/Preview/DevTools/Console';

import Navigator from './Navigator';

export default ({ alignRight, alignBottom }) => (
  <div style={{ height: '100%' }}>
    <Navigator
      alignRight={alignRight}
      alignBottom={alignBottom}
      title="Console"
    />
    <Console.Content />
  </div>
);
