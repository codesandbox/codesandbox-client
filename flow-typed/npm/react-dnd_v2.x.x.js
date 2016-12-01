// flow-typed signature: 2c9b5eea0668bccdb49ebec683da6057
// flow-typed version: 94e9f7e0a4/react-dnd_v2.x.x/flow_>=v0.23.x

// Shared
// ----------------------------------------------------------------------
// todo: add symbol once flow supports it
type Identifier = string;

type ClientOffset = {
  x: number,
  y: number
}

type DndOptions<P> = {
  arePropsEqual?: (props: P, otherProps: P) => boolean
};

type ElementOrNode = React$Element<any> | HTMLElement;

// Decorated Components
// ----------------------------------------------------------------------
declare class DndComponent<D, P, S> extends React$Component<D, P, S> {
  static defaultProps: D;
  props: P;
  state: S;

  static DecoratedComponent: Class<this>;
  getDecoratedComponentInstance(): this;
  getHandlerId(): Identifier;
}

declare class ContextComponent<D, P, S> extends React$Component<D, P, S> {
  static defaultProps: D;
  props: P;
  state: S;

  static DecoratedComponent: Class<this>;
  getDecoratedComponentInstance(): this;
  // getManager is not yet documented in ReactDnd Docs
  getManager(): any;
}

// Drag Source
// ----------------------------------------------------------------------
type DragSourceType<P> =
  Identifier |
  (props: P) => Identifier;

type DragSourceSpec<D, P, S> = {
  beginDrag: (
    props: P,
    monitor?: DragSourceMonitor,
    component?: React$Component<D, P, S>
  ) => Object,

  endDrag?: (
    props: P,
    monitor?: DragSourceMonitor,
    component?: ?React$Component<D, P, S>
  ) => void,

  canDrag?: (
    props: P,
    monitor?: DragSourceMonitor
  ) => boolean,

  isDragging?: (
    props: P,
    monitor?: DragSourceMonitor
  ) => boolean
};

type DragSourceMonitor = {
  canDrag: () => boolean,
  isDragging: () => boolean,
  getItemType: () => Identifier,
  getItem: () => Object,
  getDropResult: () => Object,
  didDrop: () => boolean,
  getInitialClientOffset: () => ClientOffset,
  getInitialSourceClientOffset: () => ClientOffset,
  getClientOffset: () => ClientOffset,
  getDifferenceFromInitialOffset: () => ClientOffset,
  getSourceClientOffset: () => ClientOffset
}

type DragSourceConnector = {
  dragSource: () => ConnectDragSource,
  dragPreview: () => ConnectDragPreview
}

type DragSourceOptions = {
  dropEffect?: string
}

type DragPreviewOptions = {
  captureDraggingState?: boolean,
  anchorX?: number,
  anchorY?: number
}

type ConnectDragSource = <T : ElementOrNode>(
  elementOrNode: T,
  options?: DragSourceOptions
) => ?T;

type ConnectDragPreview = <T : ElementOrNode>(
  elementOrNode: T,
  options?: DragPreviewOptions
) => ?T;

type DragSourceCollector = (
  connect: DragSourceConnector,
  monitor: DragSourceMonitor
) => Object;

type DragSource = <D, P, S, C: React$Component<D, P, S>>(
  type: DragSourceType<P>,
  spec: DragSourceSpec<D, P, S>,
  collect: DragSourceCollector,
  options?: DndOptions<P>
) => (component: Class<C>) => Class<DndComponent<D, P, S>>;

// Drop Target
// ----------------------------------------------------------------------
type DropTargetTypes<P> =
  Identifier |
  Array<Identifier> |
  (props: P) => Identifier | Array<Identifier>;

type DropTargetSpec<D, P, S> = {
  drop?: (
    props: P,
    monitor?: DropTargetMonitor,
    component?: React$Component<D, P, S>
  ) => ?Object,

  hover?: (
    props: P,
    monitor?: DropTargetMonitor,
    component?: React$Component<D, P, S>
  ) => void,

  canDrop?: (
    props: P,
    monitor?: DropTargetMonitor
  ) => boolean
};

type DropTargetMonitor = {
  canDrop: () => boolean,
  isOver: (options?: { shallow: boolean }) => boolean,
  getItemType: () => Identifier,
  getItem: () => Object,
  getDropResult: () => Object,
  didDrop: () => boolean,
  getInitialClientOffset: () => ClientOffset,
  getInitialSourceClientOffset: () => ClientOffset,
  getClientOffset: () => ClientOffset,
  getDifferenceFromInitialOffset: () => ClientOffset,
  getSourceClientOffset: () => ClientOffset
}

type DropTargetConnector = {
  dropTarget: () => ConnectDropTarget
}

type ConnectDropTarget = <T : ElementOrNode>(
  elementOrNode: T
) => ?T;

type DropTarget = <D, P, S, C: React$Component<D, P, S>>(
  types: DropTargetTypes<P>,
  spec: DropTargetSpec<D, P, S>,
  collect: (
    connect: DropTargetConnector,
    monitor: DropTargetMonitor
  ) => Object,
  options?: DndOptions<P>
) => (component: Class<C>) => Class<DndComponent<D, P, S>>;

// Drag Layer
// ----------------------------------------------------------------------
type DragLayerMonitor = {
  isDragging: () => boolean;
  getItemType: () => Identifier;
  getItem: () => Object;
  getInitialClientOffset: () => ClientOffset;
  getInitialSourceClientOffset: () => ClientOffset;
  getClientOffset: () => ClientOffset;
  getDifferenceFromInitialOffset: () => ClientOffset;
  getSourceClientOffset: () => ClientOffset;
}

type DragLayer = <D, P, S, C: React$Component<D, P, S>>(
  collect: (monitor: DragLayerMonitor) => Object,
  options?: DndOptions<P>
) => (component: Class<C>) => Class<DndComponent<D, P, S>>;

// Drag Drop Context
// ----------------------------------------------------------------------
type DragDropContext = <D, P, S, C: React$Component<D, P, S>>(
  backend: mixed
) => (component: Class<C>) => Class<ContextComponent<D, P, S>>;

// Top-level API
// ----------------------------------------------------------------------
declare module 'react-dnd' {
  declare var exports : {
    DragSource: DragSource,
    DropTarget: DropTarget,
    DragLayer: DragLayer,
    DragDropContext: DragDropContext
  }
}
