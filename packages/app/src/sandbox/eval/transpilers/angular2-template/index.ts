/* eslint-disable */
import { Transpiler, LoaderContext } from 'sandpack-core';

// using: regex, capture groups, and capture group variables.
const templateUrlRegex = /templateUrl\s*:(\s*['"`](.*?)['"`]\s*([,}]))/gm;
const stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
const stringRegex = /(['`"])((?:[^\\]\\\1|.)*?)\1/g;

function replaceStringsWithRequires(string, extensionConfig, addDependency) {
  let depPromises = [];
  let result = string.replace(stringRegex, (match, quote, url) => {
    if (url.charAt(0) !== '.') {
      // eslint-disable-next-line
      url = './' + url;
    }

    const urlParts = url.split('.');
    const extension = urlParts[urlParts.length - 1];
    const transpilers = extensionConfig[extension] || [];

    const finalUrl = `!raw-loader!${transpilers
      .map(t => t.transpiler.name)
      .join('!')}!${url}`;

    depPromises.push(addDependency(finalUrl, { isAbsolute: false }));

    return "require('" + finalUrl + "')";
  });

  return { result, depPromises };
}

/**
 * Converts Angular statements to css/html to require statements. Taken from
 * https://github.com/TheLarkInn/angular2-template-loader/blob/master/index.js
 *
 * @class Angular2Transpiler
 * @extends {Transpiler}
 */
class Angular2Transpiler extends Transpiler {
  constructor() {
    super('binary-loader');
  }

  async doTranspilation(code: string, loaderContext: LoaderContext) {
    const styleProperty = 'styles';
    const templateProperty = 'template';

    let promises: Array<Promise<any>> = [];
    const newSource = code
      .replace(templateUrlRegex, (match, url) => {
        // replace: templateUrl: './path/to/template.html'
        // with: template: require('./path/to/template.html')
        // or: templateUrl: require('./path/to/template.html')
        // if `keepUrl` query parameter is set to true.
        let { result, depPromises } = replaceStringsWithRequires(
          url,
          loaderContext.options.preTranspilers,
          loaderContext.addDependency
        );
        promises.push(...depPromises);
        return templateProperty + ':' + result;
      })
      .replace(stylesRegex, (match, urls) => {
        // replace: stylesUrl: ['./foo.css', "./baz.css", "./index.component.css"]
        // with: styles: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
        // or: styleUrls: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
        // if `keepUrl` query parameter is set to true.
        let { result, depPromises } = replaceStringsWithRequires(
          urls,
          loaderContext.options.preTranspilers,
          loaderContext.addDependency
        );
        promises.push(...depPromises);
        return styleProperty + ':' + result;
      });

    await Promise.all(promises);

    return {
      transpiledCode: newSource,
    };
  }
}

const transpiler = new Angular2Transpiler();

export { Angular2Transpiler };

export default transpiler;
