import Preset from '../';

import stylesTranspiler from '../../transpilers/style';
import babelTranspiler from '../../transpilers/babel';
import jsonTranspiler from '../../transpilers/json';
import rawTranspiler from '../../transpilers/raw';

export default function initialize() {
  const preset = new Preset(
    'create-react-app',
    ['web.js', 'js', 'json', 'web.jsx', 'jsx'],
    { 'react-native': 'react-native-web' },
    {
      hasDotEnv: true,
      preEvaluate: manager => {
        if (!manager.webpackHMR) {
          try {
            const children = document.body.children;
            // Do unmounting for react
            if (
              manager.manifest &&
              manager.manifest.dependencies.find(n => n.name === 'react-dom')
            ) {
              const reactDOMModule = manager.resolveModule('react-dom', '');
              const reactDOM = manager.evaluateModule(reactDOMModule);

              reactDOM.unmountComponentAtNode(document.body);

              for (let i = 0; i < children.length; i += 1) {
                if (children[i].tagName === 'DIV') {
                  reactDOM.unmountComponentAtNode(children[i]);
                }
              }
            }
          } catch (e) {
            /* don't do anything with this error */

            if (process.env.NODE_ENV === 'development') {
              console.error('Problem while cleaning up');
              console.error(e);
            }
          }
        }
      },
    }
  );

  preset.registerTranspiler(module => /\.css$/.test(module.path), [
    { transpiler: stylesTranspiler },
  ]);

  preset.registerTranspiler(module => /\.jsx?$/.test(module.path), [
    { transpiler: babelTranspiler },
  ]);

  preset.registerTranspiler(module => /\.json$/.test(module.path), [
    { transpiler: jsonTranspiler },
  ]);

  preset.registerTranspiler(() => true, [{ transpiler: rawTranspiler }]);

  return preset;
}
