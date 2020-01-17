import _debug from '@codesandbox/common/lib/utils/debug';

const debug = _debug('cs:compiler:measurements');

type MeasurementKey = string;

const runningMeasurements = new Map<string, number>();
const measurements: { [meaurement: string]: number } = {};

export function measure(key: MeasurementKey) {
  runningMeasurements.set(key, performance.now());
}

export function endMeasure(
  key: MeasurementKey,
  name?: string,
  options: {
    lastTime?: number;
  } = {}
) {
  const lastMeasurement =
    typeof options.lastTime === 'undefined'
      ? runningMeasurements.get(key)
      : options.lastTime;
  if (typeof lastMeasurement === 'undefined') {
    console.warn(
      `Measurement for '${key}' was requested, but never was started`
    );
    return;
  }

  measurements[key] = performance.now() - lastMeasurement;
  debug(`${name || key} Time: ${measurements[key].toFixed(2)}ms`);
  runningMeasurements.delete(key);
}

const MEASUREMENT_API = `https://30vlq6h5qc.execute-api.eu-west-1.amazonaws.com/prod/metrics`;

export function persistMeasurements(data: {
  sandboxId: string;
  usedCache: boolean;
  browser: string;
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
