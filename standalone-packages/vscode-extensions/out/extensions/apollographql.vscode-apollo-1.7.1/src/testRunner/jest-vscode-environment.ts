/**
 * Exposes the Visual Studio Code extension API to the Jest testing environment.
 * For custom environments reference:
 * @see https://jestjs.io/docs/en/configuration.html#testenvironment-string
 */

// Using import here results in `jest_environment_node_1.default`
// The `.default` in this case doesn't exist. Interop issue with the built
// version of the package?
const NodeEnvironment = require("jest-environment-node");
import vscode from "vscode";

class VsCodeEnvironment extends NodeEnvironment {
  public async setup() {
    await super.setup();
    this.global.vscode = vscode;
  }

  public async teardown() {
    this.global.vscode = {};
    return await super.teardown();
  }
}

module.exports = VsCodeEnvironment;
