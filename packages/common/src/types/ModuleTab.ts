import { TabType } from './TabType';

export type ModuleTab = {
  type: TabType.MODULE;
  moduleShortid: string;
  dirty: boolean;
};
