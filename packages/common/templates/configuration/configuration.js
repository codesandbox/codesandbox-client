// @flow
import type { Sandbox } from 'common/types';

export default class Configuration {
  name: string;

  /**
   * If there's no known file in the filesystem we generate one based on the current
   * state. For example, for package.json we would generate a package.json that
   * has sandbox title, sandbox entry, sandbox dependencies, and so forth.
   * @param {*} sandbox The Sandbox it's generated for
   */
  generateFileFromState(sandbox: Sandbox) {
    throw new Error('Please override this function.');
  }

  generateFileFromWizard() {}
}
