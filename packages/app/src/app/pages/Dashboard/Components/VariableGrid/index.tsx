import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAppState } from 'app/overmind';
import { Element, Stack, Text, Link } from '@codesandbox/components';
import css from '@styled-system/css';
import { VariableSizeGrid, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Sandbox } from '../Sandbox';
import { Folder } from '../Folder';
import { SyncedSandbox } from '../SyncedSandbox';
import {
  DashboardGridItem,
  DashboardSandbox,
  DashboardTemplate,
  DashboardFolder,
  DashboardHeader,
  DashboardHeaderLink,
  DashboardBlank,
  DashboardSkeleton,
  DashboardNewFolder,
  DashboardSyncedRepo,
  DashboardBranch,
  DashboardRepository,
  DashboardNewBranch,
  DashboardImportRepository,
  PageTypes,
  DashboardFooter,
} from '../../types';
import { CreateFolder } from '../Folder/CreateFolder';
import { Branch } from '../Branch';
import { Repository } from '../Repository';
import { SolidSkeleton } from '../Skeleton';
import {
  GRID_MAX_WIDTH,
  MAX_COLUMN_COUNT,
  GUTTER,
  ITEM_MIN_WIDTH,
  ITEM_HEIGHT_GRID,
  ITEM_HEIGHT_LIST,
  HEADER_HEIGHT,
  ITEM_VERTICAL_OFFSET,
  FOOTER_HEIGHT,
} from './constants';
import { ActionCard } from '../shared/ActionCard';
import { RestrictedImportDisclaimer } from '../shared/RestrictedImportDisclaimer';
import { ReadOnlyRepoDisclaimer } from '../shared/ReadOnlyRepoDisclaimer';

type WindowItemProps = {
  data: {
    columnCount: number;
    filledItems: DashboardGridItem[];
    containerWidth: number;
    viewMode: 'grid' | 'list';
    page: PageTypes;
  };
  style: React.CSSProperties;
  columnIndex: number;
  rowIndex: number;
  isScrolling: boolean;
};

type DecoratedItemProps<T> = {
  item: T;
  isScrolling?: boolean;
  page?: PageTypes;
};
interface IComponentForTypes {
  sandbox: React.FC<DecoratedItemProps<DashboardSandbox>>;
  template: React.FC<DecoratedItemProps<DashboardTemplate>>;
  folder: React.FC<DecoratedItemProps<DashboardFolder>>;
  'synced-sandbox-repo': React.FC<DecoratedItemProps<DashboardSyncedRepo>>;
  'new-folder': React.FC<DecoratedItemProps<DashboardNewFolder>>;
  header: React.FC<DecoratedItemProps<DashboardHeader>>;
  'header-link': React.FC<DecoratedItemProps<DashboardHeaderLink>>;
  blank: React.FC<DecoratedItemProps<DashboardBlank>>;
  'solid-skeleton': React.FC<DecoratedItemProps<DashboardSkeleton>>;
  branch: React.FC<DecoratedItemProps<DashboardBranch>>;
  'new-branch': React.FC<DecoratedItemProps<DashboardNewBranch>>;
  repository: React.FC<DecoratedItemProps<DashboardRepository>>;
  'import-repository': React.FC<DecoratedItemProps<DashboardImportRepository>>;
  footer: React.FC<DecoratedItemProps<DashboardFooter>>;
}

const ComponentForTypes: IComponentForTypes = {
  sandbox: React.memo(props => (
    <Sandbox
      key={props.item.sandbox.id}
      page={props.page}
      item={props.item}
      isScrolling={props.isScrolling}
    />
  )),
  template: React.memo(props => (
    <Sandbox
      page={props.page}
      item={props.item}
      isScrolling={props.isScrolling}
    />
  )),
  folder: props => <Folder key={props.item.name} {...props.item} />,
  'synced-sandbox-repo': props => (
    <SyncedSandbox {...props.item} isScrolling={props.isScrolling} />
  ),
  'new-folder': props => <CreateFolder {...props.item} />,
  header: ({ item }) => (
    <Stack justify="space-between" align="center">
      <Text block weight="regular" css={css({ userSelect: 'none' })}>
        {item.title}
      </Text>
      {item.showMoreLink
        ? ComponentForTypes['header-link']({
            item: {
              type: 'header-link' as 'header-link',
              link: item.showMoreLink,
              label: item.showMoreLabel,
            },
          })
        : null}
    </Stack>
  ),
  'header-link': ({ item }) => (
    <Link
      as={RouterLink}
      to={item.link}
      size={3}
      variant="muted"
      block
      align="right"
      style={{ userSelect: 'none' }}
    >
      {item.label}
    </Link>
  ),
  blank: () => <div />,
  'solid-skeleton': ({ item }) => <SolidSkeleton viewMode={item.viewMode} />,
  branch: ({ item, page }) => <Branch page={page} {...item} />,
  repository: ({ item }) => <Repository {...item} />,
  'new-branch': ({ item }) => (
    <ActionCard onClick={item.onClick} icon="plus" disabled={item.disabled}>
      Create branch
    </ActionCard>
  ),
  'import-repository': ({ item }) => (
    <ActionCard
      onClick={item.onImportClicked}
      icon="plus"
      disabled={item.disabled}
    >
      Import repository
    </ActionCard>
  ),
  footer: ({ item }) => {
    if (item.page === 'repositories') {
      return (
        <RestrictedImportDisclaimer insideGrid={item.viewMode === 'grid'} />
      );
    }

    if (item.page === 'repository-branches') {
      return <ReadOnlyRepoDisclaimer insideGrid={item.viewMode === 'grid'} />;
    }

    return null;
  },
};

const Item = React.memo(
  ({ data, rowIndex, columnIndex, style, isScrolling }: WindowItemProps) => {
    const { columnCount, filledItems, containerWidth, viewMode, page } = data;

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
    // 10px space to the browser edge
    const spaceReqiuredForGutters = GUTTER * (columnCount + 1) + 10;
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

    const isHeader = item.type === 'header' || item.type === 'header-link';
    const marginTopMap = {
      header: ITEM_VERTICAL_OFFSET + 24,
      'header-link': ITEM_VERTICAL_OFFSET + 28,
    };

    const margins = {
      marginTop: marginTopMap[item.type] || ITEM_VERTICAL_OFFSET,
      marginBottom: viewMode === 'list' || isHeader ? 0 : ITEM_VERTICAL_OFFSET,
    };

    const numberOfRows = Math.ceil(filledItems.length / columnCount);
    const isLastRow = rowIndex === numberOfRows - 1;
    if (isLastRow) margins.marginBottom += viewMode === 'list' ? 64 + 32 : 32;

    return (
      <div
        style={{
          ...style,
          width: eachItemWidth,
          left: leftOffset,
          height: (style.height as number) - GUTTER,
        }}
      >
        <Component item={item} page={page} isScrolling={isScrolling} />
      </div>
    );
  },
  areEqual
);

interface VariableGridProps {
  items: DashboardGridItem[];
  collectionId?: string;
  page: PageTypes;
  viewMode?: 'grid' | 'list';
}

export const VariableGrid: React.FC<VariableGridProps> = ({
  items,
  page,
  viewMode: propViewMode,
}) => {
  const { dashboard } = useAppState();

  let viewMode: 'grid' | 'list';

  if (page === 'deleted' || page === 'repository-branches') viewMode = 'list';
  else viewMode = propViewMode || dashboard.viewMode;

  const ITEM_HEIGHT = viewMode === 'list' ? ITEM_HEIGHT_LIST : ITEM_HEIGHT_GRID;

  const getRowHeight = (rowIndex, columnCount, filledItems) => {
    const item = filledItems[rowIndex * columnCount];

    if (item.type === 'header') return HEADER_HEIGHT;
    if (item.type === 'footer') return FOOTER_HEIGHT;
    if (item.type === 'blank') return 0;

    return ITEM_HEIGHT + (viewMode === 'list' ? 0 : GUTTER);
  };

  const getColumnWidth = ({
    columnCount,
    width,
  }: {
    columnCount: number;
    width: number;
  }) => {
    return width / columnCount;
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

  return (
    <Element style={{ width: '100%', height: '100%' }}>
      <AutoSizer onResize={onResize}>
        {({ width, height }) => {
          const cappedWith = Math.min(width, GRID_MAX_WIDTH);
          const columnCount =
            viewMode === 'list'
              ? 1
              : Math.min(
                  Math.floor((cappedWith - GUTTER) / (ITEM_MIN_WIDTH + GUTTER)),
                  MAX_COLUMN_COUNT
                );

          const filledItems: Array<
            DashboardGridItem & {
              viewMode?: 'list' | 'grid';
            }
          > = [];
          const blankItem = { type: 'blank' as const };
          const skeletonItem: DashboardSkeleton = {
            type: 'solid-skeleton',
            viewMode,
          };

          items.forEach((item, index) => {
            if (
              ![
                'header',
                'skeleton-row',
                'blank-row-fill',
                'template',
                'sandbox',
                'search-result',
              ].includes(item.type)
            ) {
              filledItems.push({ ...item, viewMode });
            }

            if (item.type === 'header') {
              if (columnCount === 1) {
                filledItems.push(item);
              } else {
                const { showMoreLink, showMoreLabel, ...fields } = item;
                filledItems.push(fields);
                let blanks = columnCount - 1;
                if (showMoreLink) blanks--;
                for (let i = 0; i < blanks; i++) filledItems.push(blankItem);
                if (showMoreLink) {
                  filledItems.push({
                    type: 'header-link',
                    link: showMoreLink,
                    label: showMoreLabel,
                  });
                }
              }
            } else if (item.type === 'sandbox' || item.type === 'template') {
              if (
                item.type === 'template' &&
                item.optional &&
                viewMode === 'grid'
              ) {
                // If it's optional we don't show it if we're on the second row already
                const previousRowItem = items[index - columnCount];

                if (previousRowItem?.type === 'template') {
                  // Don't add if this one is optional and we're on the second row
                  return;
                }
              }
              filledItems.push(item);

              const nextItem = items[index + 1];
              if (nextItem && nextItem.type === 'header') {
                const currentIndex = filledItems.length - 1;
                const rowIndex = currentIndex % columnCount;
                const blanks = columnCount - rowIndex - 1;
                for (let i = 0; i < blanks; i++) filledItems.push(blankItem);
              }
            } else if (item.type === 'skeleton-row') {
              for (let i = 0; i < columnCount; i++) {
                filledItems.push(skeletonItem);
              }
            } else if (item.type === 'blank-row-fill') {
              const remainingColumns =
                columnCount - (filledItems.length % columnCount);

              for (let i = 0; i < remainingColumns; i++) {
                filledItems.push(blankItem);
              }
            }

            /**
             * If it's the last item and the state is not loading,
             * create a footer element.
             */
            if (
              index === items.length - 1 &&
              items.find(i => i.type === 'skeleton-row') === undefined
            ) {
              // Fill the remaining columns w/ a blank item
              const remainingColumns =
                columnCount - (filledItems.length % columnCount);

              for (let i = 0; i < remainingColumns; i++) {
                filledItems.push(blankItem);
              }

              // Push the footer as the last item in its own row
              filledItems.push({
                page,
                type: 'footer',
                viewMode,
              });
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
                useIsScrolling
                ref={gridRef}
                columnCount={columnCount}
                rowCount={Math.ceil(filledItems.length / columnCount)}
                width={width}
                height={height}
                columnWidth={columnIndex =>
                  getColumnWidth({
                    columnCount,
                    width,
                  })
                }
                rowHeight={rowIndex =>
                  getRowHeight(rowIndex, columnCount, filledItems)
                }
                estimatedColumnWidth={width / columnCount}
                estimatedRowHeight={ITEM_HEIGHT}
                overscanRowCount={2}
                itemData={{
                  columnCount,
                  filledItems,
                  containerWidth: width,
                  viewMode,
                  page,
                }}
                style={{
                  overflowX: 'hidden',
                  userSelect: 'none',
                  paddingBottom: 24,
                  boxSizing: 'border-box',
                }}
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
