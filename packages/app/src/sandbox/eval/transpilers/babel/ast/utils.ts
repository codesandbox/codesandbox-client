import * as meriyah from 'meriyah';
import * as astring from 'astring';
import { customGenerator } from './generator';

export interface ESTreeAST {
  isDirty: boolean;
  program: meriyah.ESTree.Program;
}

export function parseModule(code: string): ESTreeAST {
  return {
    isDirty: false,
    program: meriyah.parseModule(code, {
      next: true,
      raw: true,
      jsx: true,
    }),
  };
}

export function generateCode(ast: ESTreeAST) {
  const finalCode = astring.generate(ast.program as any, {
    generator: customGenerator,
  });

  return `"use strict";\n${finalCode}`;
}
