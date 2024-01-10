/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

// TODO change this
import { getCurrentManager } from 'app/src/sandbox/compile';
// @flow
import { settle } from 'settle-promise';
import StackFrame from './stack-frame';
import { getSourceMap } from './getSourceMap';
import { getLinesAround } from './getLinesAround';

/**
 * Enhances a set of <code>StackFrame</code>s with their original positions and code (when available).
 * @param {StackFrame[]} frames A set of <code>StackFrame</code>s which contain (generated) code positions.
 * @param {number} [contextLines=3] The number of lines to provide before and after the line specified in the <code>StackFrame</code>.
 */
async function map(
  frames: StackFrame[],
  contextLines: number = 3
): Promise<StackFrame[]> {
  const cache: any = {};
  const files: string[] = [];
  frames.forEach(frame => {
    const { fileName } = frame;
    if (fileName == null) {
      return;
    }
    if (files.indexOf(fileName) !== -1) {
      return;
    }
    files.push(fileName);
  });
  await settle(
    files.map(async fileName => {
      const manager = getCurrentManager();
      if (manager != null && !fileName.startsWith('webpack')) {
        let transpiledModule;
        if (fileName.includes('?')) {
          transpiledModule = manager.getTranspiledModuleByHash(
            fileName.split('?')[1]
          );
        } else {
          transpiledModule = await manager.resolveTranspiledModule(
            fileName.replace(location.origin, ''),
            '/'
          );
        }

        if (transpiledModule) {
          const fileSource =
            transpiledModule.source && transpiledModule.source.compiledCode;

          const map = await getSourceMap(fileName, fileSource);

          cache[fileName] = { fileSource, map };
        }
      }
    })
  );
  return frames.map(frame => {
    const { functionName, fileName, lineNumber, columnNumber } = frame;
    const { map, fileSource } = cache[fileName] || {};
    if (map == null || lineNumber == null) {
      return frame;
    }
    const { source, line, column } = map.getOriginalPosition(
      lineNumber,
      columnNumber
    );
    const originalSource = source == null ? [] : map.getSource(source);
    return new StackFrame(
      functionName,
      fileName,
      lineNumber,
      columnNumber,
      getLinesAround(lineNumber, contextLines, fileSource),
      functionName,
      source,
      line,
      column,
      getLinesAround(line, contextLines, originalSource)
    );
  });
}

export { map };
export default map;
