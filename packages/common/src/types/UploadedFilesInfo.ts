import { UploadFile } from './UploadFile';

export type UploadedFilesInfo = {
  uploads: UploadFile[];
  maxSize: number;
  currentSize: number;
};
