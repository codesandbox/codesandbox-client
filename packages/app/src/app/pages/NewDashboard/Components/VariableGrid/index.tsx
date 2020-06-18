import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element, Stack, Text, Link } from '@codesandbox/components';
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
    <Stack justify="space-between" align="center">
      <Text block style={{ userSelect: 'none' }}>
        {props.title}
      </Text>
      {props.showMoreLink
        ? ComponentForTypes.headerLink({ link: props.showMoreLink })
        : null}
    </Stack>
  ),
  headerLink: props => (
    <Link
      as={RouterLink}
      to={props.link}
      size={3}
      variant="muted"
      block
      align="right"
      style={{ userSelect: 'none' }}
    >
      Show more
    </Link>
  ),
  blank: () => <div />,
  skeleton: SkeletonSandbox,
};

export const VariableGrid = ({ items }) => {
  const {
    state: { dashboard },
  } = useOvermind();

  const location = useLocation();

  let viewMode;
  if (location.pathname.includes('deleted')) viewMode = 'list';
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
     *         G    item    G    item    G    item    G
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
    const isHeader = item.type === 'header' || item.type === 'headerLink';
    const marginTopMap = {
      header: ITEM_VERTICAL_OFFSET + 24,
      headerLink: ITEM_VERTICAL_OFFSET + 28,
    };

    const margins = {
      marginTop: marginTopMap[item.type] || ITEM_VERTICAL_OFFSET,
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

  const onResize = () => {
    // force height re-calculation on resizes
    recalculatePositions();
  };

  // if view mode or items changes, recalculate everything
  React.useEffect(() => {
    recalculatePositions();
  }, [viewMode, items]);

  const gridRef = React.useRef(null);
  const recalculatePositions = () => {
    if (gridRef.current) {
      gridRef.current.resetAfterIndices({
        columnIndex: 0,
        rowIndex: 0,
        shouldForceUpdate: true,
      });
    }
  };

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
          const skeletonItem = { type: 'skeleton' };

          items.forEach((item, index) => {
            if (!['header', 'skeletonRow', 'new-sandbox'].includes(item.type)) {
              filledItems.push({ ...item, viewMode });
            }

            if (item.type === 'header') {
              if (columnCount === 1) filledItems.push(item);
              else {
                const { showMoreLink, ...fields } = item;
                filledItems.push(fields);
                let blanks = columnCount - 1;
                if (showMoreLink) blanks--;
                for (let i = 0; i < blanks; i++) filledItems.push(blankItem);
                if (showMoreLink) {
                  filledItems.push({ type: 'headerLink', link: showMoreLink });
                }
              }
            } else if (item.type === 'new-sandbox' && viewMode === 'grid') {
              filledItems.push(item);
            } else if (item.type === 'sandbox') {
              const nextItem = items[index + 1];
              if (nextItem && nextItem.type === 'header') {
                const currentIndex = filledItems.length - 1;
                const rowIndex = currentIndex % columnCount;
                const blanks = columnCount - rowIndex - 1;
                for (let i = 0; i < blanks; i++) filledItems.push(blankItem);
              }
            } else if (item.type === 'skeletonRow') {
              for (let i = 0; i < columnCount; i++) {
                filledItems.push(skeletonItem);
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
                style={{ overflowX: 'hidden', userSelect: 'none' }}
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
