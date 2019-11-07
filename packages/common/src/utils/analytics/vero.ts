import { global } from './utils';

let _script;
const _veroq: any[] = [
  ['init', { api_key: '348b8acbc93adcf7c3d647d2abb4f4c22fe880e9' }],
];

global.veroq = _veroq;

export const trackPageview = () => {
  _veroq.push(['trackPageview']);
};

// Already start tracking the first pageview
trackPageview();

function loadScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    script.src = '//d3qxef4rp70elm.cloudfront.net/m.js';
    document.body.appendChild(script);
  });
}

let _hasSetAnonymousUserId = false;

export const setAnonymousUserId = userId => {
  if (!_script) {
    _script = loadScript();
  }

  _hasSetAnonymousUserId = true;

  _script.then(() => {
    _veroq.push([
      'user',
      {
        id: userId,
      },
    ]);
  });
};

export const setUserId = userId => {
  if (!_script) {
    _script = loadScript();
  }

  _script.then(() => {
    if (_hasSetAnonymousUserId) {
      _veroq.push([
        'user',
        {
          id: userId,
        },
      ]);
    } else {
      _veroq.push(['reidentify', userId]);
    }
  });
};

export const track = (eventName: string, data: unknown) => {
  _veroq.push(['track', eventName, data]);
};
