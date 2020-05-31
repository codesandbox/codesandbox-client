export interface IEvaluator {
  evaluate(path: string, basePath?: string): Promise<any>;
}
