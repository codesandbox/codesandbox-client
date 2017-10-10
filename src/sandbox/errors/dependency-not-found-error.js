// @flow
import { actions, dispatch } from 'codesandbox-api';
import SandboxError from './sandbox-error';

export default class DependencyNotFoundError extends SandboxError {
  constructor(dependencyName: string) {
    super();
    this.path = dependencyName;

    const [root, second] = dependencyName.split('/');

    // If the package starts with a @ it's scoped, we should add the second
    // part of the name in that case
    const parsedName = root.startsWith('@') ? `${root}/${second}` : root;
    this.suggestions = [
      {
        title: `Add ${parsedName} as dependency`,
        action: () => {
          dispatch(actions.source.dependencies.add(parsedName));
        },
      },
    ];

    this.name = 'DependencyNotFoundError';
    this.message = `Could not find dependency: '${parsedName}'`;
  }
  type = 'dependency-not-found';
  severity = 'error';
  path: string;
}
