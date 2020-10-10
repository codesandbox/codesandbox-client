import React from 'react';
import { Input as BaseInput } from '@codesandbox/components';

import css from '@styled-system/css';

export const Input = (props: React.ComponentProps<typeof BaseInput>) => (
  <BaseInput css={css({ borderRadius: '4px', border: 'none' })} {...props} />
);
