import * as React from 'react';

import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Padding from '@codesandbox/common/lib/components/spacing/Padding';

export default ({ children, ...props }) => (
  <MaxWidth width={1440} {...props}>
    <Padding top={4.5} bottom={1}>
      {children}
    </Padding>
  </MaxWidth>
);
