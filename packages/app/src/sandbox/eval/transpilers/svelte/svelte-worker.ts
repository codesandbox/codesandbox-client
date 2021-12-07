import semver from 'semver';
import { ChildHandler } from '../worker-transpiler/child-handler';

const childHandler = new ChildHandler('svelte-worker');

// Allow svelte to use btoa
// @ts-ignore
self.window = self;

function getV3Code({ code, version, path }) {
  self.importScripts(`https://unpkg.com/svelte@${version}/compiler.js`);

  // @ts-ignore
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
    code: js.code,
    map: js.map,
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
  self.importScripts(`https://unpkg.com/svelte@${version}/compiler/svelte.js`);

  let error = null;
  const warnings = [];
  const {
    js: { code: compiledCode, map },
    // @ts-ignore
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
  self.importScripts(`https://unpkg.com/svelte@${version}/compiler/svelte.js`);

  let error = null;
  const warnings = [];
  // @ts-ignore
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

  let versionCode: { code: string; map: any; warnings: string[] };

  if (semver.satisfies(version, '1.x')) {
    versionCode = getV1Code({ code, version, path });
  }

  if (semver.satisfies(version, '2.x')) {
    versionCode = getV2Code({ code, version, path });
  }

  if (semver.satisfies(version, '3.x')) {
    versionCode = getV3Code({ code, version, path });
  }

  if (!versionCode) {
    throw new Error('Unsupported Svelte version');
  }

  const { code: compiledCode, map, warnings } = versionCode;

  const withInlineSourcemap = `${compiledCode}\n//# sourceMappingURL=${map.toUrl()}`;
  return {
    transpiledCode: withInlineSourcemap,
    warnings,
  };
}

childHandler.registerFunction('compile', compile);
childHandler.emitReady();
