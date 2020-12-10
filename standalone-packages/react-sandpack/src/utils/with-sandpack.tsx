import * as React from 'react';
import { Subscriber } from 'react-broadcast';

function getDisplayName(
  WrappedComponent: React.ComponentClass<any> | React.FC<any>
) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function withSandpack(
  Component: React.ComponentClass<any> | React.FC<any>
) {
  const WrappedComponent = (props: any) => (
    <Subscriber channel="sandpack">
      {sandpack => <Component {...props} sandpack={sandpack} />}
    </Subscriber>
  );

  WrappedComponent.displayName = `WithSandpack(${getDisplayName(Component)})`;

  return WrappedComponent;
}
