import { resolve } from "path";
import { spawn } from "child_process";

const cp = spawn(
  `node ${resolve(
    process.cwd(),
    "..",
    "..",
    "node_modules",
    "vscode",
    "bin",
    "test"
  )}`,
  [],
  {
    shell: true,
    env: {
      CODE_TESTS_PATH: `${process.cwd()}/lib/testRunner`,
      CODE_TESTS_WORKSPACE: process.cwd(),
      DISPLAY: process.env.DISPLAY
    }
  }
);

cp.stdout.on("data", data => {
  console.log(data.toString());
});

cp.stderr.on("data", err => {
  // Useful for debugging, but generally more noisy than useful
  // console.error({ err: err.toString() });
});

cp.on("close", code => {
  if (code !== 0) {
    process.exit(code);
  }
});
