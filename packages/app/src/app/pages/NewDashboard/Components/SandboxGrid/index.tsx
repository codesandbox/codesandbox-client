import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element, Grid, Column } from '@codesandbox/components';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Sandbox, SkeletonSandbox } from '../Sandbox';
import { Folder } from '../Folder';

const MIN_WIDTH = 220;
const ITEM_HEIGHT = 240;
const GUTTER = 24;
const GRID_VERTICAL_OFFSET = 120;
const GAP_FROM_HEADER = 32;

export const SandboxGrid = ({
  sandboxes = [],
  folders = [],
  creating = false,
  setCreating,
}) => {
  const {
    state: { dashboard },
  } = useOvermind();

  const location = useLocation();

  let viewMode;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('start')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  let items = [];
  if (creating) items.push({ type: 'folder', setCreating });

  items = [
    ...items,
    ...folders.map(folder => ({ type: 'folder', ...folder })),
    ...sandboxes.map(sandbox => ({ type: 'sandbox', ...sandbox })),
  ];

  const Item = ({ data, rowIndex, columnIndex, style }) => {
    const { columnCount } = data;

    // we need to make space for (n=columns-1) gutters and
    // the right margin by reducing width of (n=columns) items
    const widthReduction = GUTTER - 16 / columnCount;

    const item = items[rowIndex * data.columnCount + columnIndex];

    return item ? (
      <div
        style={{
          ...style,
          width: style.width - widthReduction,
          height: style.height - GUTTER,
          marginTop: GAP_FROM_HEADER,
          marginBottom: GAP_FROM_HEADER,
        }}
      >
        {item.type === 'sandbox' ? (
          <Sandbox sandbox={item} />
        ) : (
          <Folder {...item} />
        )}
      </div>
    ) : (
      <div />
    );
  };

  return (
    <Element
      css={{
        height: `calc(100vh - ${GRID_VERTICAL_OFFSET}px)`,
        marginLeft: 16,
      }}
    >
      <AutoSizer>
        {({ width, height }) => {
          const columnCount = Math.max(
            1,
            Math.floor(width / (MIN_WIDTH + GUTTER))
          );

          return (
            <FixedSizeGrid
              columnCount={viewMode === 'list' ? 1 : columnCount}
              rowCount={Math.ceil(items.length / columnCount)}
              columnWidth={width / columnCount}
              width={width}
              height={height}
              rowHeight={ITEM_HEIGHT + GUTTER}
              itemData={{ columnCount }}
              style={{ overflowX: 'hidden' }}
            >
              {Item}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    </Element>
  );
};

export const SkeletonGrid = ({ count }) => (
  <Grid
    rowGap={6}
    columnGap={6}
    marginBottom={8}
    marginTop={GAP_FROM_HEADER}
    marginX={4}
    css={{
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    }}
  >
    {Array.from(Array(count).keys()).map(n => (
      <Column key={n}>
        <SkeletonSandbox />
      </Column>
    ))}
  </Grid>
);
