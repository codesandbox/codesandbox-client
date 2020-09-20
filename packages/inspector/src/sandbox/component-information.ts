import { FileComponentInformation } from '../common/fibers';
import { parseCode } from './react';
import { Disposable } from '../common/rpc/disposable';
import { Resolver } from '.';

export class ComponentInformationResolver extends Disposable {
  componentInformationByFile = new Map<string, FileComponentInformation>();

  constructor(private resolver: Resolver) {
    super();
  }

  dispose() {
    super.dispose();

    this.componentInformationByFile.clear();
  }

  /**
   * Get the definitions of the components defined in the file
   */
  public async getComponentDefinitions(
    fromPath: string,
    toPath: string
  ): Promise<FileComponentInformation> {
    const resolverResult = await this.resolver.resolve(fromPath, toPath);

    const cachedInfo = this.componentInformationByFile.get(
      resolverResult.resolvedPath
    );
    if (cachedInfo) {
      return cachedInfo;
    }

    const componentDefinitions = parseCode(
      resolverResult.resolvedPath,
      resolverResult.code
    );
    this.componentInformationByFile.set(
      resolverResult.resolvedPath,
      componentDefinitions
    );

    return componentDefinitions;
  }
}
