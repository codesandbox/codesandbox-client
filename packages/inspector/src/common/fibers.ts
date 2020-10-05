export interface CodeRange {
  /**
   * Line number at which the range starts (starts at 1)
   */
  startLineNumber: number;
  /**
   * Column number at which the range starts (starts at 1)
   */
  startColumnNumber: number;
  /**
   * Line number at which the range ends (starts at 1)
   */
  endLineNumber: number;
  /**
   * Column number at which the range ends (starts at 1)
   */
  endColumnNumber: number;
}

export interface CodeSelection {
  selectionStartLineNumber: number;
  selectionStartColumnNumber: number;
  positionLineNumber: number;
  positionColumnNumber: number;
}

export interface CodeLocation {
  path: string;
  codePosition: CodeRange;
}

export interface Fiber {
  id: string;
  name: string | null;
  inProject: boolean;
  location: CodeLocation;
  importLocation: {
    importName: string;
    importPath: string | null;
  };
  parentFiberId: null | string;
  depth: number;
  /**
   * Its index relative to other children (so eg. 1st child has index = 0, second child has index = 1)
   */
  childIndex: number;
}

export interface ComponentInstanceData {
  name: string;
  location: CodeLocation;
  importLocation:
    | {
        importName: string;
        importPath: string | null;
      }
    | undefined;
  props: { [propName: string]: SourcePropInfo };
}

export interface StringPropTypeInfo {
  type: 'string';
}

interface UnionOption {
  name: 'literal';
  value: string;
}
export interface UnionPropTypeInfo {
  type: 'union';
  options: UnionOption[];
}
export interface BooleanPropTypeInfo {
  type: 'boolean';
}
export interface ObjectPropTypeInfo {
  type: 'object';
}
export interface NumberPropTypeInfo {
  type: 'number';
}

export type TypeInfo =
  | StringPropTypeInfo
  | BooleanPropTypeInfo
  | UnionPropTypeInfo
  | ObjectPropTypeInfo
  | NumberPropTypeInfo;

export interface StaticPropInfo {
  name: string;
  required: boolean;
  description?: string;
  defaultValue?: {
    computed: boolean;
    value: string;
  };
  typeInfo: TypeInfo | null;
}

export interface StaticComponentInformation {
  name: string;
  description?: string;
  props: StaticPropInfo[];
}

export interface SourcePropInfo {
  name: string;
  // sourceValue: string;
  definitionPosition: CodeRange;
  namePosition: CodeRange;
  valuePosition: CodeRange | null;
}

export interface FiberRuntimeInformation {
  props: {
    [propName: string]: unknown;
  };
}

export type FileComponentInformation = {
  [exportName: string]: StaticComponentInformation;
};
