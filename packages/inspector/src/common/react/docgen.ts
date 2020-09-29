// @ts-ignore
import { parse } from 'react-docgen';
import {
  FileComponentInformation,
  StaticPropInfo,
  TypeInfo,
} from '../../common/fibers';

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
  name: 'union';
  raw: string;
  elements: Array<FlowLiteralType>;
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
  props?: {
    [propName: string]: PropDescriptor;
  };
}

function getPropType(propDescriptor: PropDescriptor): TypeInfo | null {
  const types = propDescriptor.tsType || propDescriptor.flowType;
  if (types) {
    switch (types.name) {
      case 'union':
        const unionType = types as FlowElementsType;
        return {
          type: 'union',
          options: unionType.elements,
        };
      case 'number':
        return {
          type: 'number',
        };
      case 'string':
        return {
          type: 'string',
        };
      case 'boolean':
        return { type: 'boolean' };
    }
  }

  return null;
}

function convertReactDocsProp(
  propName: string,
  prop: PropDescriptor
): StaticPropInfo {
  return {
    name: propName,
    description: prop.description,
    required: Boolean(prop.required),
    typeInfo: getPropType(prop),
    defaultValue: prop.defaultValue && {
      computed: prop.defaultValue.computed,
      value: prop.defaultValue.value,
    },
  };
}

export function analyzeComponentFile(code: string): FileComponentInformation {
  const result: DocgenOutput = parse(code);

  const props = result.props || {};

  return {
    default: {
      name: result.displayName,
      description: result.description,
      props: Object.keys(props).map(propName =>
        convertReactDocsProp(propName, props[propName])
      ),
    },
  };
}
