import { FetchProtocol, Meta } from '../fetch-npm-module';

export type Transformer = (name: string, version: string) => [string, string];

/**
 * A wrapper around a protocol to transform name or version
 */
export class ProtocolTransformer implements FetchProtocol {
  constructor(
    private protocol: FetchProtocol,
    private transformer: Transformer
  ) {
    // Noop
  }

  file(name: string, version: string, path: string): Promise<string> {
    const [transformedName, transformedVersion] = this.transformer(
      name,
      version
    );

    return this.protocol.file(transformedName, transformedVersion, path);
  }

  meta(name: string, version: string): Promise<Meta> {
    const [transformedName, transformedVersion] = this.transformer(
      name,
      version
    );

    return this.protocol.meta(transformedName, transformedVersion);
  }
}
