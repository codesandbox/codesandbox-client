import ts from 'typescript';
import { ComponentInstanceData } from '../../fibers';
import { createProxyIdentifier } from '../../rpc';

export type AnalyzeRequest = {
  code: string;
  version: number;
  path: string;
};

export type GetComponentInstancesResponse = {
  version: number;
  instances: ComponentInstanceData[];
};

export interface Analyzer {
  // File update
  $fileChanged(path: string, code: string): Promise<void>;
  $fileDeleted(path: string): Promise<void>;

  $analyze(request: AnalyzeRequest): Promise<void>;
  /**
   * Get the props of the component at that specific location
   */
  $getComponentInstances(path: string): Promise<GetComponentInstancesResponse>;
}

export const analyzerProxyIdentifier = createProxyIdentifier<Analyzer>(
  'analyzer'
);
