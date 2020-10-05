import { Fiber, FileComponentInformation } from '../../common/fibers';
import getComponentName from './internals/getComponentName';
import { analyzeComponentFile } from './docgen';

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



type Renderer = {
  findHostInstanceByFiber(fiber: ReactFiber): HTMLElement;
  overrideProps(id: number, name: string, value: any): void;
};

declare global {
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: {
      getFiberRoots(rendererId: number): Set<ReactFiberRootNode>;
      renderers: Map<number, Renderer>;

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
      path: '/sandbox' + _debugSource.fileName,
      codePosition: {
        startColumnNumber: _debugSource.columnNumber,
        startLineNumber: _debugSource.lineNumber,
        endColumnNumber: _debugSource.endColumnNumber,
        endLineNumber: _debugSource.endLineNumber,
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

export class ReactSandboxBridge {
  private fiberToReact = new Map<string, ReactFiber>();

  public getFibers(): Fiber[] {
    const fiberRoots = [
      ...window.__REACT_DEVTOOLS_GLOBAL_HOOK__.getFiberRoots(1),
    ];

    return this.filterFibers(fiberRoots[0].current);
  }

  public parseComponentFile(
    path: string,
    code: string
  ): FileComponentInformation {
    return analyzeComponentFile(code);
  }

  public getElementForFiber(id: string): HTMLElement {
    const reactFiber = this.fiberToReact.get(id);
    if (!reactFiber) {
      throw new Error('Cannot find React fiber with id: ' + id);
    }

    return window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers
      .get(1)!
      .findHostInstanceByFiber(reactFiber);
  }

  public setFiberProp(id: string, name: string, value: any) {
    return window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers
      .get(1)!
      .overrideProps(parseInt(id, 10), name, value);
  }

  private filterFibers(rootFiber: ReactFiber): Fiber[] {
    const fibers: Fiber[] = [];

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
        const convertedFiber = convertFiber(
          fiber,
          parentFiber,
          depth,
          childIndex
        );
        this.fiberToReact.set(convertedFiber.id, fiber);
        fibers.push(convertedFiber);
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

    possiblyAddFiber(rootFiber, null, 0, 0);

    return fibers;
  }
}
