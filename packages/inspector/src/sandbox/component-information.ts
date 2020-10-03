import { FileComponentInformation } from '../common/fibers';
import { ReactSandboxBridge } from '../common/react/sandbox';
import { Disposable } from '../common/rpc/disposable';
import { Resolver } from '.';

export class ComponentInformationResolver extends Disposable {
  private staticComponentInformationByFile = new Map<
    string,
    FileComponentInformation
  >();

  constructor(private resolver: Resolver, private bridge: ReactSandboxBridge) {
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

    const componentDefinitions = this.bridge.parseComponentFile(
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
