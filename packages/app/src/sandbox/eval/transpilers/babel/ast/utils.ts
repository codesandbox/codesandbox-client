import * as meriyah from 'meriyah';
import * as astring from 'astring';
import { customGenerator } from './generator';

export function parseModule(code: string): meriyah.ESTree.Program {
  return meriyah.parseModule(code, {
    next: true,
    raw: true,
    jsx: true,
  });
}

export function generateCode(program: meriyah.ESTree.Program) {
  const finalCode = astring.generate(program as any, {
    generator: customGenerator,
  });

  return `"use strict";\n${finalCode}`;
}
