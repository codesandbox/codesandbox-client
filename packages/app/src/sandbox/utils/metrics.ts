import _debug from '@codesandbox/common/lib/utils/debug';
import { getGlobal } from '@codesandbox/common/lib/utils/global';

const debug = _debug('cs:compiler:measurements');

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

export function measure(key: MeasurementKey) {
  try {
    performance.mark(`${key}_start`);
    runningMeasurements.set(key, performance.now());
  } catch (e) {
    console.warn(`Something went wrong while adding measure: ${e.message}`);
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
  getCumulativeMeasure,
  getMeasurements,
};

const MEASUREMENT_API = `https://30vlq6h5qc.execute-api.eu-west-1.amazonaws.com/prod/metrics`;

export function persistMeasurements(data: {
  sandboxId: string;
  cacheUsed: boolean;
  browser: string;
  version: string;
}) {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve();
  }

  const finalData = { ...data, ...measurements };

  return fetch(MEASUREMENT_API, {
    method: 'POST',
    body: JSON.stringify(finalData),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}
