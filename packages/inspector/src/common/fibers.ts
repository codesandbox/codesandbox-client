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

interface StringProp extends BaseProp<string> {}
interface EnumProp extends BaseProp<string> {}
interface BooleanProp extends BaseProp<boolean> {}
interface ObjectProp extends BaseProp<object> {}
interface NumberProp extends BaseProp<number> {}

interface BaseProp<T> {
  type: string;
  name: string;
  required: boolean;
  defaultValue?: {
    computed: boolean;
    value: T;
  };
  description?: string;
}

export type Prop =
  | StringProp
  | BooleanProp
  | EnumProp
  | ObjectProp
  | NumberProp;

export interface ComponentInformation {
  name: string;
  description?: string;
  props: Prop[];
}

export type FileComponentInformation = {
  [exportName: string]: ComponentInformation;
};
