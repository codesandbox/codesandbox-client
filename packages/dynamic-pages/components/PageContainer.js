import * as React from 'react';

import Padding from 'common/lib/components/spacing/Padding';
import MaxWidth from 'common/lib/components/flex/MaxWidth';

export default ({ children, ...props }: { children: React.Node }) => (
  <MaxWidth width={1440} {...props}>
    <Padding top={8} bottom={1}>
      {children}
    </Padding>
  </MaxWidth>
);
