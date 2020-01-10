import { Directory } from './Directory';
import { Module } from './Module';

export type SandboxFs = {
  [path: string]: Module | Directory;
};
