export type InactivityTriggerOptions = {
  delay: number;
  interval: number;
  cb: Function;
};

export const createInactivityTrigger = ({
  delay,
  interval,
  cb,
}: InactivityTriggerOptions) => {
  let _timestamp = 0;
  let _intervalId: NodeJS.Timeout = null;
  let _isStarted: boolean = false;

  const notify = () => {
    _timestamp = Date.now();
  };

  const checkAndTrigger = () => {
    if (_timestamp > 0 && Date.now() - _timestamp >= delay) {
      // reset timestamp
      _timestamp = 0;
      cb();
    }
  };

  const isStarted = () => _isStarted;

  const start = () => {
    if (_isStarted) {
      return;
    }

    _intervalId = setInterval(checkAndTrigger, interval);
    _isStarted = true;
  };

  const stop = () => {
    if (!_isStarted) {
      return;
    }

    _isStarted = false;
    clearInterval(_intervalId);
    _intervalId = null;
    _timestamp = 0;
  };

  return {
    notify,
    start,
    stop,
    isStarted,
  };
};
