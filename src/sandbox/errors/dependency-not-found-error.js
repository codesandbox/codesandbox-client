// @flow
import SandboxError from './sandbox-error';
import actions, { dispatch } from '../actions';

export default class DependencyNotFoundError extends SandboxError {
  constructor(dependencyName: string) {
    super();

    const [root, second] = dependencyName.split('/');

    // If the package starts with a @ it's scoped, we should add the second
    // part of the name in that case
    const parsedName = root.startsWith('@') ? `${root}/${second}` : root;

    this.payload = {
      dependency: parsedName,
      path: dependencyName,
    };
    this.name = 'DependencyNotFoundError';
    this.message = `Could not find dependency: '${parsedName}'`;

    this.suggestions = [
      {
        title: `Add ${parsedName} as dependency`,
        action: () => {
          dispatch(actions.source.dependencies.add(parsedName));
        },
      },
    ];
  }
  type = 'dependency-not-found';
  severity = 'error';
}
