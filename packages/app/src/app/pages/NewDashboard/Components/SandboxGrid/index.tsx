import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Grid, List } from '@codesandbox/components';
import css from '@styled-system/css';

export const SandboxGrid = props => {
  const {
    state: { dashboard },
  } = useOvermind();

  const numberOfItems = React.Children.toArray(props.children).filter(
    React.isValidElement
  ).length;

  const location = useLocation();

  let viewMode;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  if (viewMode === 'list') {
    return <List>{props.children}</List>;
  }

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
