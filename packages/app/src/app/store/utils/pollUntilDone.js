function delay(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  });
}

// interval is how often to poll
// timeout is how long to poll waiting for a result (0 means try forever)
// url is the URL to request
function pollUntilDone(http, url, interval, timeout) {
  const start = Date.now();
  function run() {
    return http
      .request({ url })
      .then(({ result }) => {
        if (result.status.status !== 'IN_PROGRESS') {
          // we know we're done here, return from here whatever you
          // want the final resolved value of the promise to be
          return result;
        }
        if (timeout !== 0 && Date.now() - start > timeout) {
          throw new Error('timeout error on pollUntilDone');
        } else {
          // run again with a short delay
          return delay(interval).then(run);
        }
      })
      .catch(e => e);
  }
  return run();
}

export default pollUntilDone;
