import React from 'react';
import { Grid } from '@codesandbox/components';
import css from '@styled-system/css';

export const SandboxGrid = props => {
  const numberOfItems = React.Children.toArray(props.children).filter(
    React.isValidElement
  ).length;

  return (
    <Grid
      rowGap={6}
      columnGap={6}
      marginBottom={8}
      css={css({
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      })}
    >
      {props.children}
      {numberOfItems < 4
        ? // fill with empty divs to always maintain 4 elements in a group
          Array.from(Array(4 - numberOfItems).keys()).map(n => <div key={n} />)
        : null}
    </Grid>
  );
};
