import React from 'react';
import * as Icons from './all';

function Icon({ name, ...props }) {
  const Component = Icons[name];
  return <Component {...props} />;
}

export default Icons;
