import _debug from '@codesandbox/common/lib/utils/debug';
import { getGlobal } from '@codesandbox/common/lib/utils/global';

const debug = _debug('cs:compiler:measurements');

type MeasurementKey = string;

const runningMeasurements = new Map<string, number>();
const measurements: { [measurement: string]: number } = {};

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
  name?: string,
  options: {
    lastTime?: number;
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
      return;
    }

    const nowMeasurement = performance.now();

    measurements[key] = nowMeasurement - lastMeasurement;
    debug(`${name || key} Time: ${measurements[key].toFixed(2)}ms`);
    const hadKey = runningMeasurements.delete(key);

    performance.measure(key, hadKey ? `${key}_start` : undefined, `${key}_end`);
  } catch (e) {
    console.warn(`Something went wrong while adding measure: ${e.message}`);
  }
}

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
