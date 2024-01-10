import { TranspiledModule } from './transpiled-module';

export interface IEvaluator {
  evaluate(path: string, baseTModule?: TranspiledModule): Promise<any>;
}
