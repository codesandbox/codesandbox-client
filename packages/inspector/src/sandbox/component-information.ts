import { FileComponentInformation } from '../common/fibers';
import { ReactBridge } from './react';
import { Disposable } from '../common/rpc/disposable';
import { Resolver } from '.';

export class ComponentInformationResolver extends Disposable {
  private staticComponentInformationByFile = new Map<
    string,
    FileComponentInformation
  >();

  constructor(private resolver: Resolver, private bridge: ReactBridge) {
    super();
  }

  dispose() {
    super.dispose();

    this.staticComponentInformationByFile.clear();
  }

  /**
   * Get the definitions of the components defined in the file
   */
  public async getComponentDefinitions(
    fromPath: string,
    toPath: string
  ): Promise<FileComponentInformation> {
    const resolverResult = await this.resolver.resolve(fromPath, toPath);

    const cachedInfo = this.staticComponentInformationByFile.get(
      resolverResult.resolvedPath
    );
    if (cachedInfo) {
      return cachedInfo;
    }

    const componentDefinitions = this.bridge.parseCode(
      resolverResult.resolvedPath,
      resolverResult.code
    );

    this.staticComponentInformationByFile.set(
      resolverResult.resolvedPath,
      componentDefinitions
    );

    return componentDefinitions;
  }
}
