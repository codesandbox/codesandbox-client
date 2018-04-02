import React from 'react';
import Tests from 'app/components/Preview/DevTools/Tests';

import Navigator from './Navigator';

export default ({ alignRight, alignBottom }) => (
  <div>
    <Navigator
      alignRight={alignRight}
      alignBottom={alignBottom}
      title="Tests"
    />
    <Tests.Content standalone />
  </div>
);
