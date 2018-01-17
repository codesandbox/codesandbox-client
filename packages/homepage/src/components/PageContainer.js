import * as React from 'react';

import MaxWidth from 'common/components/flex/MaxWidth';
import Padding from 'common/components/spacing/Padding';

export default ({ children, ...props }: { children: React.Node }) => (
  <MaxWidth {...props}>
    <Padding top={8} bottom={1}>
      {children}
    </Padding>
  </MaxWidth>
);
