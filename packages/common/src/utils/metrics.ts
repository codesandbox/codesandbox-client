import _debug from './debug';
import { getGlobal } from './global';

const debug = _debug('cs:measurements');

type MeasurementKey = string;

const runningMeasurements = new Map<string, number>();
let measurements: { [measurement: string]: number } = {};

const global = getGlobal();
if (typeof global.performance === 'undefined') {
  global.performance = {
    mark: () => {},
    now: () => Date.now(),
    measure: () => {},
  };
}

export function now(): number {
  try {
    return performance.now();
  } catch (err) {
    console.warn(err);
    return 0;
  }
}

export function measure(key: MeasurementKey): number {
  try {
    performance.mark(`${key}_start`);
    const currentTime = now();
    runningMeasurements.set(key, currentTime);
    return currentTime;
  } catch (e) {
    console.warn(`Something went wrong while adding measure: ${e.message}`);
    return 0;
  }
}

export function endMeasure(
  key: MeasurementKey,
  options: {
    displayName?: string;
    lastTime?: number;
    silent?: boolean;
  } = {}
) {
  try {
    const { lastTime } = options;
    performance.mark(`${key}_end`);

    const lastMeasurement =
      typeof lastTime === 'undefined' ? runningMeasurements.get(key) : lastTime;

    if (typeof lastMeasurement === 'undefined') {
      console.warn(
        `Measurement for '${key}' was requested, but never was started`
      );
      return 0;
    }

    const nowMeasurement = performance.now();

    measurements[key] = nowMeasurement - lastMeasurement;
    if (!options.silent) {
      debug(
        `${options.displayName || key} Time: ${measurements[key].toFixed(2)}ms`
      );
    }
    const hadKey = runningMeasurements.delete(key);

    performance.measure(key, hadKey ? `${key}_start` : undefined, `${key}_end`);

    return measurements[key];
  } catch (e) {
    console.warn(`Something went wrong while adding measure: ${e.message}`);
    return 0;
  }
}

/**
 * Get the cumulative of a specific measurement by prefix. If you had for example these measurements:
 * - transpile-index.js
 * - transpile-test.js
 *
 * You can get the sum of these measurements with getCumulativeMeasure('transpile', 'Transpilation')
 */
export function getCumulativeMeasure(
  prefix: string,
  options: { displayName?: string; silent?: boolean } = {}
) {
  const keys = Object.keys(measurements).filter(p =>
    p.startsWith(prefix + '-')
  );

  const totalTime = keys.reduce((prev, key) => prev + measurements[key], 0);

  if (!options.silent) {
    debug(
      `${options.displayName || prefix} Total Time: ${totalTime.toFixed(2)}ms`
    );
    debug(`  Average Time: ${(totalTime / keys.length).toFixed(2)}ms`);
  }

  return totalTime;
}

export function clearMeasurements() {
  measurements = {};
  runningMeasurements.clear();
}

export function getMeasurements() {
  return measurements;
}

getGlobal().measurements = {
  clearMeasurements,
  getCumulativeMeasure,
  getMeasurements,
};

const MEASUREMENT_API = `https://col.csbops.io/data/sandpack`;

export function persistMeasurements(data: {
  sandboxId: string;
  cacheUsed: boolean;
  browser: string;
  version: string;
}): Promise<Response | void> {
  const body = [
    {
      measurement: 'load_times',
      tags: {
        browser: data.browser,
        cache_used: data.cacheUsed,
        version: data.version,
      },
      fields: {
        transpilation: measurements.transpilation,
        evaluation: measurements.evaluation,
        external_resources: measurements['external-resources'],
        compilation: measurements.compilation,
        boot: measurements.boot,
        total: measurements.total,
        dependencies: measurements.dependencies,
      },
    },
  ];

  if (process.env.NODE_ENV === 'development' || process.env.STAGING) {
    // eslint-disable-next-line
    console.log(body);
    return Promise.resolve();
  }

  // Ignore external call for on-prem deploys
  // @ts-ignore
  if (window._env_?.IS_ONPREM === 'true') {
    return Promise.resolve();
  }

  return fetch(MEASUREMENT_API, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}
