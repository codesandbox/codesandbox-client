import { Directory } from './Directory';
import { CustomTemplate } from './CustomTemplate';
import { ForkedSandbox } from './ForkedSandbox';
import { GitInfo } from './Git';
import { Module } from './Module';
import { TemplateType } from '../templates';
import { User } from './User';

export type Sandbox = {
  id: string;
  alias: string | null;
  title: string | null;
  description: string | null;
  viewCount: number;
  likeCount: number;
  forkCount: number;
  userLiked: boolean;
  modules: Module[];
  directories: Directory[];
  collection?: {
    path: string;
  };
  owned: boolean;
  npmDependencies: {
    [dep: string]: string;
  };
  customTemplate: CustomTemplate | null;
  /**
   * Which template this sandbox is based on
   */
  forkedTemplate: CustomTemplate | null;
  /**
   * Sandbox the forked template is from
   */
  forkedTemplateSandbox: ForkedSandbox | null;
  externalResources: string[];
  team: {
    id: string;
    name: string;
  } | null;
  roomId: string | null;
  privacy: 0 | 1 | 2;
  author: User | null;
  forkedFromSandbox: ForkedSandbox | null;
  git: GitInfo | null;
  tags: string[];
  isFrozen: boolean;
  environmentVariables: {
    [key: string]: string;
  } | null;
  /**
   * This is the source it's assigned to, a source contains all dependencies, modules and directories
   *
   * @type {string}
   */
  sourceId: string;
  source?: {
    template: string;
  };
  template: TemplateType;
  entry: string;
  originalGit: GitInfo | null;
  originalGitCommitSha: string | null;
  originalGitChanges: {
    added: string[];
    modified: string[];
    deleted: string[];
    rights: 'none' | 'read' | 'write' | 'admin';
  } | null;
  version: number;
  screenshotUrl: string | null;
  previewSecret: string | null;
};
