/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

/* eslint-disable no-use-before-define, no-restricted-syntax, no-await-in-loop */

import { getState, dispatch } from 'jest-circus/build/state';
import {
  callAsyncFn,
  getAllHooksForDescribe,
  getEachHooksForTest,
  makeTestResults,
} from 'jest-circus/build/utils';
import { SnapshotState } from 'jest-snapshot';
import expect from 'expect';

import {
  TestEntry,
  TestResults,
  TestContext,
  Hook,
  DescribeBlock,
} from './types';

const currentDescribeBlocks = [];

const run = async (): Promise<TestResults> => {
  const { rootDescribeBlock } = getState();
  currentDescribeBlocks.length = 0;
  dispatch({ name: 'run_start' });
  await _runTestsForDescribeBlock(rootDescribeBlock);
  dispatch({ name: 'run_finish' });
  return makeTestResults(getState().rootDescribeBlock);
};

const _setGlobalState = (test: TestEntry) => {
  const { testPath: currentTestPath } = expect.getState();
  const [testPath, testName] = test.name.split(':#:');

  // remove root block
  const [, ...describeBlocks] = [...currentDescribeBlocks];
  const describeName =
    describeBlocks.length > 0 ? describeBlocks.join(' ') + ' ' : '';

  const currentTestName = describeName + testName;
  const update: {
    // @ts-ignore
    snapshotState?: SnapshotState;
    testPath?: string;
    currentTestName: string;
  } = { currentTestName };
  if (testPath == null || currentTestPath !== testPath) {
    // @ts-ignore
    update.snapshotState = new SnapshotState(testPath, {
      expand: true,
      updateSnapshot: 'none',
    });
    update.testPath = testPath;
  }

  expect.setState(update);
};

const _runTestsForDescribeBlock = async (describeBlock: DescribeBlock) => {
  currentDescribeBlocks.push(describeBlock.name);
  dispatch({ describeBlock, name: 'run_describe_start' });
  const { beforeAll, afterAll } = getAllHooksForDescribe(describeBlock);

  for (const hook of beforeAll) {
    _callHook(hook);
  }
  for (const test of describeBlock.tests) {
    await _runTest(test);
  }
  for (const child of describeBlock.children) {
    await _runTestsForDescribeBlock(child);
  }

  for (const hook of afterAll) {
    _callHook(hook);
  }
  dispatch({ describeBlock, name: 'run_describe_finish' });
  currentDescribeBlocks.pop();
};

const _runTest = async (test: TestEntry): Promise<void> => {
  const testContext = Object.create(null);

  const isSkipped =
    test.mode === 'skip' ||
    (getState().hasFocusedTests && test.mode !== 'only');

  if (isSkipped) {
    dispatch({ name: 'test_skip', test });
    return;
  }

  const { afterEach, beforeEach } = getEachHooksForTest(test);

  for (const hook of beforeEach) {
    await _callHook(hook, testContext);
  }

  await _callTest(test, testContext);

  for (const hook of afterEach) {
    await _callHook(hook, testContext);
  }
};

const _callHook = (hook: Hook, testContext?: TestContext): Promise<any> => {
  dispatch({ hook, name: 'hook_start' });
  const { testTimeout: timeout } = getState();
  return callAsyncFn(hook.fn, testContext, { isHook: true, timeout })
    .then(() => dispatch({ hook, name: 'hook_success' }))
    .catch(error => dispatch({ error, hook, name: 'hook_failure' }));
};

const _callTest = async (
  test: TestEntry,
  testContext: TestContext
): Promise<any> => {
  dispatch({ name: 'test_start', test });
  const { testTimeout: timeout } = getState();

  if (!test.fn) {
    throw Error(`Tests with no 'fn' should have 'mode' set to 'skipped'`);
  }
  _setGlobalState(test);

  return callAsyncFn(test.fn, testContext, { isHook: false, timeout })
    .then(() => dispatch({ name: 'test_success', test }))
    .catch(error => dispatch({ error, name: 'test_failure', test }));
};

export default run;
