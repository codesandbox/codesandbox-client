// @flow
import SandboxError from './sandbox-error';
import actions, { dispatch } from '../actions';
import { sendReady } from '../';

const parseDependencyName = (dependency: string) => {
  const match = dependency.match(/(.*?)\//);

  if (match) return match[1];
  return dependency;
};

export default class DependencyNotFoundError extends SandboxError {
  constructor(dependencyName: string) {
    super();

    const parsedName = parseDependencyName(dependencyName);
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
          setTimeout(() => {
            sendReady();
          }, 0);
        },
      },
    ];
  }
  type = 'dependency-not-found';
  severity = 'error';
}
