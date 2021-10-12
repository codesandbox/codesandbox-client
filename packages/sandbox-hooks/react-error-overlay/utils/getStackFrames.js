/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* @flow */
import type { StackFrame } from './stack-frame';
import { parse } from './parser';
import { map } from './mapper';
import { unmap } from './unmapper';

export async function getStackFrames(
  error: Error,
  unhandledRejection: boolean = false,
  contextSize: number = 3
): Promise<StackFrame[] | null> {
  const parsedFrames = parse(error);
  let enhancedFrames;
  // $FlowFixMe
  if (error.__unmap_source) {
    enhancedFrames = await unmap(
      // $FlowFixMe
      error.__unmap_source,
      parsedFrames,
      contextSize
    );
  } else {
    enhancedFrames = await map(parsedFrames, contextSize);
  }

  if (
    enhancedFrames
      .map(f => f._originalFileName)
      .filter(f => f != null && f.indexOf('node_modules') === -1).length === 0
  ) {
    return null;
  }

  return enhancedFrames.filter(({ functionName }) => 
    functionName == null || functionName.indexOf('__stack_frame_overlay_proxy_console__') === -1
  );
}
