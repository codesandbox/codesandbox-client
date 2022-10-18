import React from 'react';

import { Text } from '@codesandbox/components';

interface LabelProps {
  htmlFor: string;
  children: string;
}

export const Label = ({ htmlFor, children }: LabelProps) => (
  <Text
    as="label"
    htmlFor={htmlFor}
    size={12}
    css={{ color: '#999999', letterSpacing: '0.005em' }}
  >
    {children}
  </Text>
);
