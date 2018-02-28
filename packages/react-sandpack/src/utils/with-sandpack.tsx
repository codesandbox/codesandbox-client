import * as React from 'react';
import { Subscriber } from 'react-broadcast';

import { ISandpackContext } from '../types';

export default function withSandpack(Component: React.ComponentClass<any>) {
  return (props: any) => (
    <Subscriber channel="sandpack">
      {sandpack => <Component {...props} sandpack={sandpack} />}
    </Subscriber>
  );
}
