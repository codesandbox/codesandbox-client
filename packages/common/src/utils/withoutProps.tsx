// Based on https://github.com/styled-components/styled-components/pull/2093#issuecomment-461510706
import React from 'react';

export const withoutProps = (...omitProps: string[]) => {
  const omitSingle = (object = {}, key: string) => {
    if (key === null || key === undefined || !(key in object)) return object;
    const { [key]: deleted, ...otherKeys }: { [key: string]: any } = object;
    return otherKeys;
  };

  const omit = (object = {}, keys: string[]) => {
    if (!keys) return object;
    if (Array.isArray(keys)) {
      return keys.reduce((result, key) => {
        if (key in result) {
          return omitSingle(result, key);
        }
        return result;
      }, object);
    }
    return omitSingle(object, keys);
  };

  return (Component: React.RefForwardingComponent<any, any>) => {
    const componentWithoutProps = React.forwardRef((props, ref) => (
      <Component ref={ref} {...omit(props, omitProps)} />
    ));

    if (Component.displayName) {
      componentWithoutProps.displayName = `${Component.displayName}WithoutProps`;
    }

    return componentWithoutProps;
  };
};
