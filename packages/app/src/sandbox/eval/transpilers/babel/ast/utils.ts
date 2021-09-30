import * as meriyah from 'meriyah';
import { generate } from 'meriyah-printer';
import { customGenerator } from './generator';

export interface ESTreeAST {
  isDirty: boolean;
  program: meriyah.ESTree.Program;
}

export function parseModule(code: string): ESTreeAST {
  return {
    isDirty: false,
    program: meriyah.parseModule(code, {
      module: true,
      webcompat: true,
      directives: false,
      next: true,
      raw: true,
      jsx: true,
      loc: false,
      ranges: false,
    }),
  };
}

export function generateCode(ast: ESTreeAST) {
  const finalCode = generate(ast.program as any, {
    generator: customGenerator,
  });

  return `"use strict";\n${finalCode}`;
}
