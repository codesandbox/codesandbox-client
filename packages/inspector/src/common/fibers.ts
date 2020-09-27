export interface Position {
  startLineNumber: number;
  startColumnNumber: number;
  endLineNumber: number;
  endColumnNumber: number;
}

export interface CodeLocation {
  path: string;
  codePosition: Position;
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

export interface PropInfo {
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
  props: PropInfo[];
}

export type FileComponentInformation = {
  [exportName: string]: StaticComponentInformation;
};
