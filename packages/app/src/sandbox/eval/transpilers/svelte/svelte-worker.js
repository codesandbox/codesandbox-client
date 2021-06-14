import semver from 'semver';
import { ChildHandler } from '../worker-transpiler/child-handler';

const childHandler = new ChildHandler('svelte-worker');

// Allow svelte to use btoa
self.window = self;

function getV3Code({ code, version, path }) {
  self.importScripts([`https://unpkg.com/svelte@${version}/compiler.js`]);

  const { js, warnings } = self.svelte.compile(code, {
    filename: path,
    dev: true,
  });

  // Fallback to generate sourcemaps on Svelte 3.13+
  // See https://github.com/codesandbox/codesandbox-client/pull/3114
  if (!js.map.toUrl) {
    js.map.toUrl = () =>
      'data:application/json;charset=utf-8;base64,' +
      btoa(JSON.stringify(js.map));
  }

  return {
    code: js,
    warnings: warnings.map(w => ({
      fileName: w.fileName,
      lineNumber: w.start && w.start.line,
      columnNumber: w.start && w.start.column,
      message: w.message,
      source: 'svelte',
    })),
  };
}

function getV2Code({ code, version, path }) {
  self.importScripts([
    `https://unpkg.com/svelte@${version}/compiler/svelte.js`,
  ]);

  let error = null;
  const warnings = [];
  const {
    js: { code: compiledCode, map },
  } = self.svelte.compile(code, {
    filename: path,
    dev: true,
    cascade: false,
    store: true,

    onerror: err => {
      error = err;
    },

    onwarn: w => {
      warnings.push({
        fileName: w.fileName,
        lineNumber: w.loc && w.loc.line,
        columnNumber: w.loc && w.loc.column,
        message: w.message,
        source: 'svelte',
      });
    },
  });

  if (error) {
    throw error;
  }

  return { code: compiledCode, map, warnings };
}

function getV1Code({ code, version, path }) {
  self.importScripts([
    `https://unpkg.com/svelte@${version}/compiler/svelte.js`,
  ]);

  let error = null;
  const warnings = [];
  const { code: compiledCode, map } = self.svelte.compile(code, {
    filename: path,
    dev: true,
    cascade: false,
    store: true,

    onerror: err => {
      error = err;
    },

    onwarn: w => {
      warnings.push({
        fileName: w.fileName,
        lineNumber: w.loc && w.loc.line,
        columnNumber: w.loc && w.loc.column,
        message: w.message,
        source: 'svelte',
      });
    },
  });

  if (error) {
    throw error;
  }

  return { code: compiledCode, map, warnings };
}

async function compile(data) {
  const { code, path, version } = data;
  let versionCode = '';

  if (semver.satisfies(version, '1.x')) {
    versionCode = getV1Code({ code, version, path });
  }

  if (semver.satisfies(version, '2.x')) {
    versionCode = getV2Code({ code, version, path });
  }

  if (semver.satisfies(version, '3.x')) {
    versionCode = getV3Code({ code, version, path });
  }

  const { code: compiledCode, map, warnings } = versionCode;

  const withInlineSourcemap = `${compiledCode}
    //# sourceMappingURL=${map.toUrl()}`;

  return {
    transpiledCode: withInlineSourcemap,
    warnings,
  };
}

childHandler.registerFunction('compile', compile);
childHandler.emitReady();
