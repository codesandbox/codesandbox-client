import qs from 'querystring';
import { compileStyle } from 'vue3-browser-compiler';
import { LoaderContext } from 'sandpack-core';

// This is a post loader that handles scoped CSS transforms.
// Injected right before css-loader by the global pitcher (../pitch.js)
// for any <style scoped> selection requests initiated from within vue files.
function StylePostLoader(
  source: string,
  loaderContext: LoaderContext
): { transpiledCode: string } {
  const query = qs.parse(loaderContext.resourceQuery.slice(1));
  const { code, errors } = compileStyle({
    source: source as string,
    filename: loaderContext.path,
    id: `data-v-${query.id}`,
    scoped: !!query.scoped,
    vars: !!query.vars,
    trim: true,
  });

  if (errors.length) {
    throw errors[0];
  } else {
    return {
      transpiledCode: code,
    };
  }
}

export default StylePostLoader;
