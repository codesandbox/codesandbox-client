import { global } from './utils';

let _script;
const _veroq: any[] = [
  ['init', { api_key: '348b8acbc93adcf7c3d647d2abb4f4c22fe880e9' }],
];

global.veroq = _veroq;

/**
 * For some reason vero doesn't call it, so we do it for them.
 */
function processArray() {
  if (
    typeof global.__vero !== 'undefined' &&
    typeof global.__vero.processVeroArray === 'function'
  ) {
    global.__vero.processVeroArray(_veroq);
  }
}

export const trackPageview = () => {
  _veroq.push(['trackPageview']);
  processArray();
};

// Already start tracking the first pageview
trackPageview();

function loadScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.onload = resolve;
    script.onerror = () => {
      reject(new Error('Could not load script'));
    };
    script.src = '//d3qxef4rp70elm.cloudfront.net/m.js';
    document.body.appendChild(script);
  })
    .then(() => {
      processArray();
    })
    .catch(() => {
      /* ignore */
    });
}

let _hasSetAnonymousUserId = false;

export const setAnonymousUserId = (userId: string) => {
  if (!_script) {
    _script = loadScript();
  }

  _hasSetAnonymousUserId = true;

  _veroq.push([
    'user',
    {
      id: userId,
      email: 'anon@codesandbox.io',
    },
  ]);
  processArray();
};

export const setUserId = (userId: string, email: string) => {
  if (!_script) {
    _script = loadScript();
  }

  if (_hasSetAnonymousUserId) {
    _veroq.push([
      'user',
      {
        id: userId,
        email,
      },
    ]);
  } else {
    _veroq.push(['reidentify', userId]);
  }
  processArray();
};

export const track = (eventName: string, data: unknown) => {
  _veroq.push(['track', eventName, data]);
  processArray();
};
