var process = {
  stdout: {
    write: (...data) => console.log(...data),
  },
  stderr: {
    write: (...data) => console.warn(...data),
  },
  env: {},
};
