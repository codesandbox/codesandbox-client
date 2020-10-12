import {
  ComponentInstanceData,
  StaticComponentInformation,
} from '../../fibers';
import { createProxyIdentifier } from '../../rpc';

export type GetComponentInstancesResponse = {
  version: number;
  instances: ComponentInstanceData[];
};

export interface Analyzer {
  // File update
  $fileChanged(path: string, code: string, version: number): void;
  $fileDeleted(path: string): void;

  /**
   * Get the props of the component at that specific location
   */
  $getComponentInstances(path: string): Promise<GetComponentInstancesResponse>;

  $getComponentInfo(
    relativePath: string,
    fromPath: string,
    exportName: string
  ): Promise<StaticComponentInformation | undefined>;
}

export const analyzerProxyIdentifier = createProxyIdentifier<Analyzer>(
  'analyzer'
);
