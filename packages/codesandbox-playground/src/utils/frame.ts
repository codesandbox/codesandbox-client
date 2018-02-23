export interface IFiles {
  [path: string]: {
    code: string;
  };
}

export interface IModules {
  [path: string]: {
    code: string;
    path: string;
  };
}

export interface IDependencies {
  [depName: string]: string;
}

export function sendCode(
  frame: HTMLIFrameElement,
  files: IFiles,
  dependencies: IDependencies,
  entry: string
) {
  const modules: IModules = Object.keys(files).reduce(
    (prev, next) => ({
      ...prev,
      [next]: {
        code: files[next].code,
        path: next,
      },
    }),
    {}
  );

  modules['/package.json'] = {
    code: JSON.stringify({
      name: 'run',
      main: entry,
      dependencies,
    }),
    path: '/package.json',
  };

  frame.contentWindow.postMessage(
    {
      type: 'compile',
      codesandbox: true,
      version: 3,
      modules,
      entry: entry,
      dependencies: dependencies,
      externalResources: [],
      template: 'create-react-app',
    },
    '*'
  );
}
