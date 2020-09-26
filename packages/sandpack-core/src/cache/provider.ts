import { ParsedConfigurationFiles } from '@codesandbox/common/lib/templates/template';
import { SerializedTranspiledModule } from '../transpiled-module';

export type ManagerCache = {
  id: string;
  transpiledModules: { [id: string]: SerializedTranspiledModule };
  cachedPaths: { [path: string]: { [path: string]: string } };
  timestamp: number;
  configurations: ParsedConfigurationFiles;
  entry: string | undefined;
  meta: { [dir: string]: string[] };
  dependenciesQuery: string;
  version: string;
};

export type CacheContext = {
  changes: number;
  firstRun: boolean;
};

export interface CacheProvider {
  initialize(): Promise<void>;
  load(id: string): Promise<ManagerCache | undefined>;
  save(id: string, cache: ManagerCache, context: CacheContext): Promise<void>;
  delete(id: string, version: string): Promise<void>;
  clear(): Promise<void>;
}
