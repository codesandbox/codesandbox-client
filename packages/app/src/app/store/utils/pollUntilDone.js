function delay(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  });
}

function pollUntilDone(http, url, interval, timeout) {
  const start = Date.now();
  function run() {
    return http
      .request({ url })
      .then(({ result }) => {
        if (result.status.status !== 'IN_PROGRESS') {
          // DOOOONE
          return result;
        }
        if (timeout !== 0 && Date.now() - start > timeout) {
          return result;
        }
        // run again with a short delay
        return delay(interval).then(run);
      })
      .catch(e => e);
  }
  return run();
}

export default pollUntilDone;
