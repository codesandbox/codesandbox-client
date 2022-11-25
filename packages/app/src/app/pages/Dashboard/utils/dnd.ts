import {
  useDrop as untypedUseDrop,
  useDrag as untypedUseDrag,
  DropTargetHookSpec,
  ConnectDropTarget,
  DragSourceHookSpec,
  ConnectDragPreview,
} from 'react-dnd';
import {
  DashboardSandbox,
  DashboardFolder,
  DashboardTemplate,
  PageTypes,
} from '../types';

export type DndDropType = {
  page: PageTypes;
  path: string;
  isSamePath: boolean;
};

type CollectionReturn = {
  canDrop: boolean;
  isOver: boolean;
  isDragging: boolean;
};

export type DragItemType =
  | DashboardSandbox
  | DashboardFolder
  | DashboardTemplate;

/**
 * We re-export `useDrop` and `useDrag` from `react-dnd` with the right types attached to it. This way
 * we ensure consistency whenever we use `useDrop` and `useDrag` in the codebase.
 */
export const useDrop: <CollectedProps = CollectionReturn>(
  spec: DropTargetHookSpec<DragItemType, DndDropType, CollectedProps>
) => [CollectedProps, ConnectDropTarget] = untypedUseDrop;

export const useDrag: <CollectedProps = CollectionReturn>(
  spec: DragSourceHookSpec<DragItemType, DndDropType, CollectedProps>
) => [CollectedProps, ConnectDropTarget, ConnectDragPreview] = untypedUseDrag;
