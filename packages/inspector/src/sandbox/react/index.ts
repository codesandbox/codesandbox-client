import { Fiber, FileComponentInformation } from '../../common/fibers';
import getComponentName from './internals/getComponentName';
import { analyzeCode } from './docgen';

/**
 * Additional properties have been added by CodeSandbox
 */
export type Source = {
  fileName: string;
  lineNumber: number;
  columnNumber: number;

  /**
   * Added by CSB
   */
  endLineNumber: number;
  endColumnNumber: number;

  /**
   * If imported these values will be set. `importName` being the export, `importPath` being the relative path
   * to this file.
   */
  importName: string;
  importPath: string | null;
};

/**
 * A Fiber is work on a Component that needs to be done or was done. There can
 * be more than one per component.
 */
export interface ReactFiber {
  key: string | null;
  /**
   * The Fiber to return to after finishing processing this one.
   * This is effectively the parent, but there can be multiple parents (two)
   * so this is only the parent of the thing we're currently processing.
   * It is conceptually the same as the return address of a stack frame.
   */
  return: ReactFiber | null;
  alternate: ReactFiber | null;
  child: ReactFiber | null;
  sibling: ReactFiber | null;
  index: number;

  /**
   * The resolved function/class/ associated with this fiber.
   */
  type: Function | Symbol | string | null | any;

  actualDuration?: number;
  actualStartTime?: number;
  selfBaseDuration?: number;
  treeBaseDuration?: number;

  /**
   * The local state associated with this fiber.
   */
  stateNode: any;

  _debugID: number;
  _debugSource?: Source | null;
  _debugOwner?: ReactFiber;
}

export interface ReactFiberRootNode {
  tag: Element;
  current: ReactFiber;
}

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: {
      getFiberRoots(rendererId: number): Set<ReactFiberRootNode>;
    };
  }
}

function convertFiber(
  fiber: ReactFiber,
  parentFiber: ReactFiber | null,
  depth: number,
  childIndex: number
): Fiber {
  const _debugSource = fiber._debugSource!;
  return {
    id: fiber._debugID.toString(),
    name: getComponentName(fiber.type),
    inProject: true,
    location: {
      path: _debugSource.fileName,
      codePosition: {
        startColumnNumber: _debugSource.columnNumber,
        startLineNumber: _debugSource.lineNumber,
        endColumnNumber: _debugSource.endColumnNumber,
        endLineNumber: _debugSource.lineNumber,
      },
    },
    importLocation: {
      // We only allow elements where this is set, so force them.
      importName: _debugSource.importName!,
      importPath: _debugSource.importPath,
    },
    parentFiberId: parentFiber?._debugID.toString() || null,
    depth,
    childIndex,
  };
}

function filterFibers(fiber: ReactFiber): Fiber[] {
  let fibers: Fiber[] = [];

  const isValidFiber = (fiber: ReactFiber) =>
    fiber.type &&
    fiber._debugSource &&
    fiber._debugSource.importName &&
    typeof fiber.type !== 'string' &&
    typeof fiber.type !== 'symbol';

  const possiblyAddFiber = (
    fiber: ReactFiber,
    parentFiber: ReactFiber | null,
    depth: number,
    childIndex: number
  ) => {
    if (isValidFiber(fiber)) {
      fibers.push(convertFiber(fiber, parentFiber, depth, childIndex));
    }

    let chIndex = 0;
    let sibling = fiber.sibling;
    while (sibling) {
      possiblyAddFiber(sibling, parentFiber, depth, ++chIndex);
      sibling = sibling.sibling;
    }

    if (fiber.child) {
      if (isValidFiber(fiber)) {
        possiblyAddFiber(fiber.child, fiber, depth + 1, 0);
      } else {
        possiblyAddFiber(fiber.child, parentFiber, depth, 0);
      }
    }
  };

  possiblyAddFiber(fiber, null, 0, 0);

  return fibers;
}

export function getFibers(): Fiber[] {
  const fiberRoots = [
    ...window.__REACT_DEVTOOLS_GLOBAL_HOOK__.getFiberRoots(1),
  ];

  return filterFibers(fiberRoots[0].current);
}

export function parseCode(
  path: string,
  code: string
): FileComponentInformation {
  return analyzeCode(code);
}
