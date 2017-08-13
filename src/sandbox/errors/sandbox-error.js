// @flow
import type { Module } from 'common/types';

export default class SandboxError extends Error {
  severity: 'error' | 'warning';
  type: string;
  module: Module;
  payload: ?Object;
}
