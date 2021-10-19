import * as meriyah from 'meriyah';
import { generate } from '@meriyah-utils/printer';
import { customGenerator } from './generator';

export function parseModule(code: string): meriyah.ESTree.Program {
  return meriyah.parseModule(code, {
    module: true,
    webcompat: true,
    directives: false,
    next: true,
    raw: true,
    jsx: true,
    loc: false,
    ranges: false,
  });
}

export function generateCode(ast: meriyah.ESTree.Program) {
  const finalCode = generate(ast, {
    generator: customGenerator,
  });

  return `"use strict";\n${finalCode}`;
}
