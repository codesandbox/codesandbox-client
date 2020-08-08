import { CsbFetcher } from './csb';
import { UnpkgFetcher } from './unpkg';
import { JSDelivrNPMFetcher } from './jsdelivr/jsdelivr-npm';
import { JSDelivrGHFetcher } from './jsdelivr/jsdelivr-gh';
import { TarFetcher } from './tar';
import { FileFetcher } from './file';

export const protocols = {
  csbGH: new CsbFetcher(),
  unpkg: new UnpkgFetcher(),
  jsDelivrNPM: new JSDelivrNPMFetcher(),
  jsDelivrGH: new JSDelivrGHFetcher(),
  tar: new TarFetcher(),
  file: new FileFetcher(),
};
