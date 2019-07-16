// Tell Babel to transform JSX into h() calls:
/** @jsx h */
import io from 'socket.io-client';
import { Terminal } from 'xterm';
import { render, h } from 'preact'; // eslint-disable-line import/extensions
import * as fit from 'xterm/lib/addons/fit/fit';
import * as WebfontLoader from 'xterm-webfont';
import 'xterm/dist/xterm.css';
import CSSPlugin from 'gsap/CSSPlugin';
import AttrPlugin from 'gsap/AttrPlugin';
import { Power3 } from 'gsap/EasePack';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';

import getTemplate from '@codesandbox/common/lib/templates';

import Cube from './Cube';

const SECOND = 1000; // ms

// without this line, CSSPlugin and AttrPlugin may get dropped by your bundler...
// eslint-disable-next-line
const plugins = [CSSPlugin, AttrPlugin];

let color;

let hostParts;
if (process.env.NODE_ENV === 'development') {
  hostParts = ['gatsby', 'sse', 'codesandbox', 'stream']; // dev
} else {
  hostParts = window.location.hostname.split('.');
}
const rootDomain = `codesandbox.${hostParts[hostParts.length - 1]}`;
const domain = `sse.${rootDomain}`;
// parses sandboxid[-port]
const sandbox = hostParts[0].replace(/-\d+/, '');
const port = hostParts[0].replace(/^\w+-?/, '');
const lastLoadedAt = parseInt(localStorage.getItem('last_loaded_at'), 10);
const now = Date.now();
let isLoop = false;
let reloadTimeout = null;

if (lastLoadedAt) {
  const timeDiff = now - lastLoadedAt;
  if (timeDiff <= 5 * SECOND) {
    isLoop = true;
  }
}

function createCube(element, id, noAnimation = false, styles = {}) {
  return render(
    <Cube width={75} style={styles} noAnimation={noAnimation} id={id} />,
    element
  );
}

const cubeEl = document.getElementById('cube');
const createMainCube = () => {
  TweenLite.set('#cubescaler', { scale: 0.75 });
  createCube(cubeEl, 'main', true);
  TweenLite.fromTo(cubeEl, 1, { opacity: 0 }, { opacity: 1 });

  const cubeTl = new TimelineLite({
    onComplete() {
      const clearerColor = color && color.clearer(0.4);
      TweenLite.to(
        '.side',
        0.5,
        clearerColor
          ? {
              boxShadow: `0 0 150px ${clearerColor()}`,
              backgroundColor: clearerColor(),
            }
          : {}
      );
      TweenLite.to(
        '#loading-progress',
        0.5,
        color
          ? {
              backgroundColor: color(),
            }
          : {}
      );
      this.restart();
    },
  });

  createCube(cubeEl, 'a', true, { opacity: 0 });
  createCube(cubeEl, 'b', true, { opacity: 0 });
  createCube(cubeEl, 'c', true, { opacity: 0 });
  createCube(cubeEl, 'd', true, { opacity: 0 });
  createCube(cubeEl, 'e', true, { opacity: 0 });
  createCube(cubeEl, 'f', true, { opacity: 0 });
  createCube(cubeEl, 'g', true, { opacity: 0 });

  const ease = Power3.easeInOut;

  cubeTl
    .delay(1.5)
    .fromTo(
      '#a',
      0.5,
      { ease, opacity: 0, x: 83, y: 46 },
      { ease, opacity: 1, x: 53, y: 26 },
      '-=.3'
    )
    .fromTo(
      '#b',
      0.5,
      { ease, opacity: 0, x: -83, y: 44 },
      { ease, opacity: 1, x: -53, y: 24 },
      '-=.6'
    )
    .fromTo(
      '#c',
      0.5,
      { ease, opacity: 0, x: 0, y: -84 },
      { ease, opacity: 1, x: 0, y: -66 },
      '-=.3'
    )
    .fromTo(
      '#d',
      0.5,
      { ease, opacity: 0, x: 0, y: 70 },
      { ease, opacity: 1, x: 0, y: 50 },
      '-=.4'
    )
    .fromTo(
      '#e',
      0.5,
      { ease, opacity: 0, x: -72, y: -62 },
      { ease, opacity: 1, x: -52, y: -42 },
      '-=.3'
    )
    .fromTo(
      '#f',
      0.5,
      { ease, opacity: 0, x: 73, y: -61 },
      { ease, opacity: 1, x: 53, y: -41 },
      '-=.4'
    )
    .fromTo(
      '#g',
      0.5,
      { ease, opacity: 0, x: 0, y: -42, scale: 1.1 },
      { ease, opacity: 1, x: 0, y: -16, scale: 1 },
      '-=.4'
    )
    .delay(0.5)
    .to(cubeEl, 0.5, { scale: 0.5, y: -19 })
    .to('#main', 0.5, { scale: 2 }, '-=.5')
    .to(
      ['#a', '#b', '#c', '#d', '#e', '#f', '#g'],
      0.3,
      { opacity: 0 },
      '-=.1'
    );

  // topfront 0 -16
  // topleft -52 -42
  // topright 53 -41

  // createCube(cubeEl, 'second', true);
  // TweenLite.to('#second', 0.5, { x: 53, y: 26 });
  // createCube(cubeEl, 'third', true);
  // TweenLite.to('#third', 0.5, { x: -53, y: 24 });
  // createCube(cubeEl, 'fourth', true);
  // TweenLite.to('#fourth', 0.5, { x: 0, y: -66 });
};

setTimeout(createMainCube, 500);

const NICE_TITLES = {
  'starting-container': 'Initializing Sandbox Container',
  'installing-packages': 'Installing Packages',
  'starting-sandbox': 'Starting Sandbox',
  started: 'Succesfully Initialized!',
};

const CRAWL_TIME = {
  'starting-container': 13,
  'installing-packages': 30,
  'starting-sandbox': 20,
};

async function start() {
  const el = document.getElementById('term');

  Terminal.applyAddon(fit);
  Terminal.applyAddon(WebfontLoader);

  const term = new Terminal({
    fontFamily: 'Source Code Pro',
    rendererType: 'dom',
    allowTransparency: true,
    fontSize: 14,
    disableStdin: true,
    theme: {
      background: 'transparent',
      cursorStyle: 'underline',
    },
  });

  el.innerHTML = '';
  term.open(el);

  term.fit();

  const socket = io(`https://${domain}`, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    socket.emit('sandbox', { id: sandbox });
    socket.emit('sandbox:start');
  });

  socket.on('sandbox:log', ({ data }) => {
    term.write(data);
    if (reloadTimeout) {
      clearTimeout(reloadTimeout);
    }
    reloadTimeout = setTimeout(() => {
      window.location.reload(true);
    }, 10 * SECOND);
  });

  socket.on('sandbox:error', ({ message, unrecoverable }) => {
    if (unrecoverable) {
      document.getElementById('loading-text').textContent = message;
      socket.close();
    }
  });

  window.s = socket;

  const maximizeTerminal = () => {
    const tl = new TimelineLite();

    tl.to('#cubescaler', 0.5, { height: 0, opacity: 0 })
      .to('#term', 0.8, { height: 500, background: '#0a0b0c' }, '-=.3')
      .to('#loading', 0.8, { maxWidth: 850 }, '-=.8')
      .call(() => {
        term.fit();
      });
  };

  const updateStatus = (current, total, status) => {
    const percentage = ((current - 1) / total) * 100;

    const barTl = new TimelineLite();
    barTl
      .to('#loading-progress', 0.3, { width: percentage + '%' })
      .to('#loading-progress', CRAWL_TIME[status] || 30, {
        width: percentage + 100 / total + '%',
      });

    document.getElementById('loading-text').textContent = NICE_TITLES[status];

    if (current === total) {
      maximizeTerminal();
    }
  };

  socket.on('sandbox:status', data => {
    if (!data.progress) {
      return;
    }

    updateStatus(data.progress.current, data.progress.total, data.status);
  });

  socket.on('sandbox:port', portList => {
    portList.forEach(({ hostname, port: newPort }) => {
      if (hostname === window.location.hostname || newPort.toString() === port) {
        setTimeout(() => {
          window.location.reload(true);
        }, SECOND);
      }
    })
  });

  socket.on('sandbox:start', () => {
    updateStatus(4, 3, 'started');
  });

  window.addEventListener('resize', () => term.fit());

  socket.connect();
}

if (isLoop) {
  document.getElementById('loading-text').textContent = 'Error: Reloading too fast.';
} else {
  localStorage.setItem('last_loaded_at', now);

  if (process.env.NODE_ENV === 'production') {
    fetch(`https://${rootDomain}/api/v1/sandboxes/${sandbox}/slim`)
      .then(res => {
        if (res.status === 404) {
          window.location.replace(`https://${rootDomain}/s/${sandbox}`);
          return {};
        }

        return res.json();
      })
      .then(json => {
        if (Object.keys(json) > 0 && !json.is_sse) {
          window.location.replace(`https://${sandbox}.${rootDomain}/`);
        }
        if (json.template) {
          const templateDef = getTemplate(json.template);

          color =
            json.template === 'next'
              ? templateDef.color.darken(0.3)
              : templateDef.color;
        }
      });
  } else {
    setTimeout(() => {
      const templateDef = getTemplate('gatsby');

      color = templateDef.color;
    }, 1200);
  }

  start();
}
