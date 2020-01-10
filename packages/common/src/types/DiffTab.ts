import { TabType } from './TabType';

export type DiffTab = {
  id: string;
  type: TabType.DIFF;
  codeA: string;
  codeB: string;
  titleA: string;
  titleB: string;
  fileTitle?: string;
};
