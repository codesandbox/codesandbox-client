import React from 'react';

import { Text } from '@codesandbox/components';

interface LabelProps {
  htmlFor: string;
  children: string;
}

export const Label = ({ htmlFor, children }: LabelProps) => (
  <Text as="label" htmlFor={htmlFor} color="#e5e5e5">
    {children}
  </Text>
);
