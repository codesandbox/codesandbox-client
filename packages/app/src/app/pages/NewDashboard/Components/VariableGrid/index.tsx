import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element, Grid, Column, Stack, Text } from '@codesandbox/components';
import { VariableSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Sandbox, SkeletonSandbox } from '../Sandbox';
import { NewSandbox } from '../Sandbox/NewSandbox';
import { Folder } from '../Folder';
import { EmptyScreen } from '../EmptyScreen';

export const GRID_MAX_WIDTH = 992;
export const GUTTER = 24;
const ITEM_MIN_WIDTH = 220;
const ITEM_HEIGHT_GRID = 240;
const ITEM_HEIGHT_LIST = 64;
const HEADER_HEIGHT = 64;
const GRID_VERTICAL_OFFSET = 120;
const ITEM_VERTICAL_OFFSET = 32;

const ComponentForTypes = {
  sandbox: props => <Sandbox sandbox={props} />,
  folder: props => <Folder {...props} />,
  'new-sandbox': props => <NewSandbox {...props} />,
  header: props => (
    <Text block css={{ userSelect: 'none' }}>
      {props.title}
    </Text>
  ),
  blank: () => <div />,
};

export const VariableGrid = ({ items }) => {
  const {
    state: { dashboard },
  } = useOvermind();

  const location = useLocation();

  let viewMode;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('home')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  const ITEM_HEIGHT = viewMode === 'list' ? ITEM_HEIGHT_LIST : ITEM_HEIGHT_GRID;

  const Item = ({ data, rowIndex, columnIndex, style }) => {
    const { columnCount, filledItems, containerWidth } = data;

    /**
     * react-window does not support gutter or maxWidth
     * we take over the width and offset calculations
     * to add these features
     *
     * |     |----[       ]----[       ]----[       ]----|     |
     *         G    item    G     item   G     item   G
     */

    // adjusting total width based on allowed maxWidth
    const totalWidth = Math.min(containerWidth, GRID_MAX_WIDTH);
    const containerLeftOffset =
      containerWidth > GRID_MAX_WIDTH
        ? (containerWidth - GRID_MAX_WIDTH) / 2
        : 0;

    // we calculate width by making enough room for gutters between
    // each item + on the 2 ends
    const spaceReqiuredForGutters = GUTTER * (columnCount + 1);
    const spaceLeftForItems = totalWidth - spaceReqiuredForGutters;
    const numberOfItems = columnCount;
    const eachItemWidth = spaceLeftForItems / numberOfItems;

    // to get the left offset, we need to add the space taken by
    // previous elements + the gutter just before this item
    const spaceTakenBeforeThisItem =
      containerLeftOffset + columnIndex * (eachItemWidth + GUTTER);
    const leftOffset = spaceTakenBeforeThisItem + GUTTER;

    const index = rowIndex * data.columnCount + columnIndex;
    const item = filledItems[index];
    if (!item) return null;

    const Component = ComponentForTypes[item.type];
    const isHeader = item.type === 'header';

    const margins = {
      marginTop: isHeader ? ITEM_VERTICAL_OFFSET + 24 : ITEM_VERTICAL_OFFSET,
      marginBottom: viewMode === 'list' || isHeader ? 0 : ITEM_VERTICAL_OFFSET,
    };

    return (
      <div
        style={{
          ...style,
          width: eachItemWidth,
          left: leftOffset,
          height: style.height - GUTTER,
          ...margins,
        }}
      >
        <Component {...item} />
      </div>
    );
  };

  const getRowHeight = (rowIndex, columnCount, filledItems) => {
    const item = filledItems[rowIndex * columnCount];

    if (item.type === 'header') return HEADER_HEIGHT;
    if (item.type === 'blank') return 0;
    return ITEM_HEIGHT + (viewMode === 'list' ? 0 : GUTTER);
  };

  const gridRef = React.useRef(null);

  const onResize = () => {
    // force height re-calculation on resize
    // only useful for views with group headers
    if (gridRef.current) {
      gridRef.current.resetAfterIndices({
        columnIndex: 0,
        rowIndex: 0,
        shouldForceUpdate: true,
      });
    }
  };

  // if view mode changes, recalculate everything
  React.useEffect(
    function resetRowHeights() {
      if (gridRef.current) {
        gridRef.current.resetAfterIndices({
          columnIndex: 0,
          rowIndex: 0,
          shouldForceUpdate: true,
        });
      }
    },
    [viewMode]
  );

  /**
   * Imperatively find and focus the selected item
   * 1. Get event from Selection with id
   * 2. Find the index for id in filledItems
   * 3. Find the row number for index
   * 4. scroll to the row
   */
  const filledItemsRef = React.useRef([]);
  const containerRef = React.useRef();

  React.useEffect(function imperativelyFindAndScroll() {
    const containerElement = containerRef.current as HTMLElement;

    const handler = (event: CustomEvent) => {
      const index = filledItemsRef.current.findIndex(
        item => item.id === event.detail
      );

      const columnCount = parseInt(containerElement.dataset.columnCount, 10);
      const rowToFocus = Math.floor(index / columnCount) + 1;

      gridRef.current.scrollToItem({ rowIndex: rowToFocus });
    };

    if (containerElement) {
      containerElement.addEventListener('scrollToItem', handler, false);
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener('scrollToItem', handler, false);
      }
    };
  });

  if (items.length === 0) return <EmptyScreen />;

  return (
    <Element
      css={{
        height: `calc(100vh - ${GRID_VERTICAL_OFFSET}px)`,
      }}
    >
      <AutoSizer onResize={onResize}>
        {({ width, height }) => {
          const columnCount =
            viewMode === 'list'
              ? 1
              : Math.min(
                  Math.floor((width - GUTTER) / (ITEM_MIN_WIDTH + GUTTER)),
                  4
                );

          const filledItems = [];
          const blankItem = { type: 'blank' };

          items.forEach((item, index) => {
            filledItems.push(item);
            if (item.type === 'header') {
              const blanks = columnCount - 1;
              for (let i = 0; i < blanks; i++) filledItems.push(blankItem);
            } else if (item.type === 'sandbox') {
              const nextItem = items[index + 1];
              if (nextItem && nextItem.type === 'header') {
                const currentIndex = filledItems.length - 1;
                const rowIndex = currentIndex % columnCount;
                const blanks = columnCount - rowIndex - 1;
                for (let i = 0; i < blanks; i++) filledItems.push(blankItem);
              }
            }
          });

          filledItemsRef.current = filledItems;

          return (
            <div
              id="variable-grid"
              data-column-count={columnCount}
              ref={containerRef}
            >
              <VariableSizeGrid
                ref={gridRef}
                columnCount={columnCount}
                rowCount={Math.ceil(filledItems.length / columnCount)}
                width={width}
                height={height}
                columnWidth={index => width / columnCount}
                rowHeight={rowIndex =>
                  getRowHeight(rowIndex, columnCount, filledItems)
                }
                estimatedColumnWidth={width / columnCount}
                estimatedRowHeight={ITEM_HEIGHT}
                overscanRowCount={2}
                itemData={{ columnCount, filledItems, containerWidth: width }}
                style={{ overflowX: 'hidden' }}
              >
                {Item}
              </VariableSizeGrid>
            </div>
          );
        }}
      </AutoSizer>
    </Element>
  );
};

export const SkeletonGrid = ({ count, ...props }) => {
  const {
    state: { dashboard },
  } = useOvermind();

  const location = useLocation();

  let viewMode;
  if (location.pathname.includes('deleted')) viewMode = 'list';
  else if (location.pathname.includes('home')) viewMode = 'grid';
  else viewMode = dashboard.viewMode;

  if (viewMode === 'list') {
    return (
      <Stack
        direction="vertical"
        marginBottom={8}
        marginTop={ITEM_VERTICAL_OFFSET}
        marginX={4}
        {...props}
      >
        {Array.from(Array(count).keys()).map(n => (
          <Column key={n}>
            <SkeletonSandbox />
          </Column>
        ))}
      </Stack>
    );
  }

  return (
    <Grid
      rowGap={6}
      columnGap={6}
      marginX={4}
      css={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      }}
      {...props}
    >
      {Array.from(Array(count).keys()).map(n => (
        <Column key={n}>
          <SkeletonSandbox />
        </Column>
      ))}
      {/* fill empty columns in grid */}
      {count < 4 &&
        Array.from(Array(4 - count).keys()).map(n => (
          <Column key={count + n} />
        ))}
    </Grid>
  );
};
