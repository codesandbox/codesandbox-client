/*
 * Wrapper around Jest's runCLI function. Responsible for passing in the config,
 * executing, and passing along failures.
 */
import { ResultsObject, runCLI } from "jest";
import { resolve } from "path";
import { config } from "./jest-config";

export async function run(_testRoot: string, callback: TestRunnerCallback) {
  const writeStreamRefs = forwardWriteStreams();

  try {
    const testDirectory = resolve(__dirname, "..", "..", "src");
    const { results } = await runCLI(config, [testDirectory]);

    restoreWriteStreams(writeStreamRefs);

    const failures = collectTestFailureMessages(results);

    if (failures.length > 0) {
      callback(null, failures);
      process.exit(1);
    }

    callback(null);
  } catch (e) {
    callback(e);
    process.exit(1);
  }
}

/**
 * Collect failure messages from Jest test results.
 *
 * @param results Jest test results.
 */
function collectTestFailureMessages(results: ResultsObject): string[] {
  const failures = results.testResults.reduce<string[]>((acc, testResult) => {
    if (testResult.failureMessage) acc.push(testResult.failureMessage);
    return acc;
  }, []);

  return failures;
}

/**
 * Forward writes to process.stdout and process.stderr to console.log.
 *
 * For some reason this seems to be required for the Jest output to be streamed
 * to the Debug Console.
 */
function forwardWriteStreams() {
  const outRef = process.stdout.write;
  const errRef = process.stderr.write;

  process.stdout.write = logger;
  process.stderr.write = logger;

  return { outRef, errRef };
}

function restoreWriteStreams(refs: { outRef: any; errRef: any }) {
  process.stdout.write = refs.outRef;
  process.stderr.write = refs.errRef;
}

function logger(line: string) {
  console.log(line);
  return true;
}

export type TestRunnerCallback = (error: Error | null, failures?: any) => void;
