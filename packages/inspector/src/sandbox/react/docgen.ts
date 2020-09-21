// @ts-ignore
import { parse } from 'react-docgen';
import { FileComponentInformation, Prop } from 'src/common/fibers';

export type PropTypeDescriptor = {
  name:
    | 'arrayOf'
    | 'custom'
    | 'enum'
    | 'array'
    | 'bool'
    | 'func'
    | 'number'
    | 'object'
    | 'string'
    | 'any'
    | 'element'
    | 'node'
    | 'symbol'
    | 'objectOf'
    | 'shape'
    | 'exact'
    | 'union'
    | 'elementType';
  value?: any;
  raw?: string;
  computed?: boolean;
  // These are only needed for shape/exact types.
  // Consider consolidating PropTypeDescriptor and PropDescriptor
  description?: string;
  required?: boolean;
};

export type FlowBaseType = {
  required?: boolean;
  nullable?: boolean;
  alias?: string;
};

export type FlowSimpleType = FlowBaseType & {
  name: string;
  raw?: string;
};

export type FlowLiteralType = FlowBaseType & {
  name: 'literal';
  value: string;
};

export type FlowElementsType = FlowBaseType & {
  name: string;
  raw: string;
  elements: Array<FlowTypeDescriptor>;
};

export type FlowFunctionArgumentType = {
  name: string;
  type?: FlowTypeDescriptor;
  rest?: boolean;
};

export type FlowFunctionSignatureType = FlowBaseType & {
  name: 'signature';
  type: 'function';
  raw: string;
  signature: {
    arguments: Array<FlowFunctionArgumentType>;
    return: FlowTypeDescriptor;
  };
};

export type TSFunctionSignatureType = FlowBaseType & {
  name: 'signature';
  type: 'function';
  raw: string;
  signature: {
    arguments: Array<FlowFunctionArgumentType>;
    return: FlowTypeDescriptor;
    this?: FlowTypeDescriptor;
  };
};

export type FlowObjectSignatureType = FlowBaseType & {
  name: 'signature';
  type: 'object';
  raw: string;
  signature: {
    properties: Array<{
      key: string | FlowTypeDescriptor;
      value: FlowTypeDescriptor;
    }>;
    constructor?: FlowTypeDescriptor;
  };
};

export type FlowTypeDescriptor =
  | FlowSimpleType
  | FlowLiteralType
  | FlowElementsType
  | FlowFunctionSignatureType
  | FlowObjectSignatureType;

export type PropDescriptor = {
  type?: PropTypeDescriptor;
  flowType?: FlowTypeDescriptor;
  tsType?: FlowTypeDescriptor;
  required?: boolean;
  defaultValue?: any;
  description?: string;
};

export interface DocgenOutput {
  description: string;
  displayName: string;
  methods: unknown[];
  props: {
    [propName: string]: PropDescriptor;
  };
}

function convertReactDocsType(propDescriptor: PropDescriptor): Prop['type'] {
  const types = propDescriptor.tsType || propDescriptor.flowType;
  if (types) {
    switch (types.name) {
      case 'union':
        return 'enum';
      case 'number':
        return 'number';
      case 'string':
        return 'string';
      case 'boolean':
        return 'boolean';
    }
  }

  return 'object';
}

export function analyzeCode(code: string): FileComponentInformation {
  const result: DocgenOutput = parse(code);

  return {
    default: {
      name: result.displayName,
      description: result.description,
      props: Object.keys(result.props).map(propName => {
        const prop = result.props[propName];
        const type = convertReactDocsType(prop) as Prop['type'];
        return {
          name: propName,
          description: prop.description,
          required: Boolean(prop.required),
          type,
          defaultValue: prop.defaultValue && {
            computed: prop.defaultValue.computed,
            value: prop.defaultValue.value,
          },
        };
      }),
    },
  };
}
