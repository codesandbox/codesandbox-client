import React from 'react';
import { Grid } from '@codesandbox/components';
import css from '@styled-system/css';

export const SandboxGrid = props => (
  <Grid
    rowGap={6}
    columnGap={6}
    marginBottom={8}
    css={css({
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    })}
  >
    {props.children}
  </Grid>
);
