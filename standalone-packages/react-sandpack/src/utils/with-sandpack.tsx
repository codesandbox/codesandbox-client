import * as React from 'react';
import { Subscriber } from 'react-broadcast';

import { ISandpackContext } from '../types';

function getDisplayName(WrappedComponent: React.ComponentClass<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withSandpack(Component: React.ComponentClass<any>) {
  const WrappedComponent = (props: any) => (
    <Subscriber channel="sandpack">
      {sandpack => <Component {...props} sandpack={sandpack} />}
    </Subscriber>
  );

  (WrappedComponent as React.SFC).displayName = `WithSandpack(${getDisplayName(
    Component
  )})`;

  return WrappedComponent;
}
