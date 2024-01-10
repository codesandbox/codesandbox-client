import path from 'path';
import { LoaderContext } from '../../../transpiled-module';

const matchRelativePath = /^\.\.?[/\\]/;

function isAbsolutePath(str: string) {
  return str.startsWith('/');
}

function isRelativePath(str: string) {
  return matchRelativePath.test(str);
}

export default function stringifyRequest(
  loaderContext: LoaderContext,
  request: string
) {
  const splitted = request.split('!');
  const context = loaderContext.options && loaderContext.options.context;
  return JSON.stringify(
    splitted
      .map(part => {
        // First, separate singlePath from query, because the query might contain paths again
        const splittedPart = part.match(/^(.*?)(\?.*)/);
        let singlePath = splittedPart ? splittedPart[1] : part;
        const query = splittedPart ? splittedPart[2] : '';
        if (isAbsolutePath(singlePath) && context) {
          singlePath = path.relative(context, singlePath);
          if (isAbsolutePath(singlePath)) {
            // If singlePath still matches an absolute path, singlePath was on a different drive than context.
            // In this case, we leave the path platform-specific without replacing any separators.
            // @see https://github.com/webpack/loader-utils/pull/14
            return singlePath + query;
          }
          if (isRelativePath(singlePath) === false) {
            // Ensure that the relative path starts at least with ./ otherwise it would be a request into the modules directory (like node_modules).
            singlePath = './' + singlePath;
          }
        }
        return singlePath.replace(/\\/g, '/') + query;
      })
      .join('!')
  );
}
