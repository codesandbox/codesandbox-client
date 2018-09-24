// Tell Babel to transform JSX into h() calls:
/** @jsx h */
import io from 'socket.io-client';
import { Terminal } from 'xterm';
import { render, h } from 'preact';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as WebfontLoader from 'xterm-webfont';
import 'xterm/dist/xterm.css';
import CSSPlugin from 'gsap/CSSPlugin';
import AttrPlugin from 'gsap/AttrPlugin';
import { Power3 } from 'gsap/EasePack';
import TweenLite from 'gsap/TweenLite';
import TimelineLite from 'gsap/TimelineLite';

import Cube from './Cube';

// without this line, CSSPlugin and AttrPlugin may get dropped by your bundler...
// eslint-disable-next-line
const plugins = [CSSPlugin, AttrPlugin];

function createCube(element, id, noAnimation = false, styles = {}) {
  return render(
    <Cube width={75} style={styles} noAnimation={noAnimation} id={id} />,
    element
  );
}

const cubeEl = document.getElementById('cube');
const createMainCube = () => {
  createCube(cubeEl, 'main', true);
  TweenLite.fromTo(cubeEl, 1, { opacity: 0 }, { opacity: 1 });

  const cubeTl = new TimelineLite({
    onComplete() {
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
    .to(cubeEl, 0.5, { scale: 0.5, y: -56 })
    .to('#main', 0.5, { scale: 2 }, '-=.5')
    .to(
      ['#a', '#b', '#c', '#d', '#e', '#f', '#g'],
      0.3,
      { opacity: 0 },
      '-=.1'
    );

  //topfront 0 -16
  //topleft -52 -42
  //topright 53 -41

  // createCube(cubeEl, 'second', true);
  // TweenLite.to('#second', 0.5, { x: 53, y: 26 });
  // createCube(cubeEl, 'third', true);
  // TweenLite.to('#third', 0.5, { x: -53, y: 24 });
  // createCube(cubeEl, 'fourth', true);
  // TweenLite.to('#fourth', 0.5, { x: 0, y: -66 });
};

setTimeout(createMainCube, 500);

// const hostParts = window.location.hostname.split('.');
const hostParts = ['gatsby', 'sse', 'codesandbox', 'stream']; // dev
const rootDomain = `codesandbox.${hostParts[hostParts.length - 1]}`;
const domain = `sse.${rootDomain}`;
const sandbox = hostParts[0];

const NICE_TITLES = {
  'starting-container': 'Initializing Sandbox Container',
  'installing-packages': 'Installing Packages',
  'starting-sandbox': 'Starting Sandbox',
};

fetch(`https://${rootDomain}/api/v1/sandboxes/${sandbox}/slim`).then(res => {
  if (res.status === 404) {
    window.location.replace(`https://notfound.sse.${domain}/`);
  }
});

async function start() {
  const el = document.getElementById('term');

  Terminal.applyAddon(fit);
  Terminal.applyAddon(WebfontLoader);

  const term = new Terminal({
    fontFamily: 'Menlo',
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
  });

  socket.on('connect', () => {
    socket.emit('sandbox', { id: sandbox });
    socket.emit('sandbox:start');
  });

  socket.on('sandbox:log', ({ chan, data }) => {
    term.write(data);
  });

  window.s = socket;

  const maximizeTerminal = () => {
    const tl = new TimelineLite();

    tl.to('#cube', 0.5, { height: 0, opacity: 0 })
      .to('#term', 0.8, { height: 500, background: '#0a0b0c' }, '-=.3')
      .to('#loading', 0.8, { maxWidth: 850 }, '-=.8')
      .call(() => {
        term.fit();
      });
  };

  socket.on('sandbox:status', data => {
    const percentage = (data.progress.current / data.progress.total) * 100;

    const barTl = new TimelineLite();
    barTl
      .to('#loading-progress', 0.3, { width: percentage + '%' })
      .to('#loading-progress', 20, { width: percentage + 10 + '%' });

    document.getElementById('loading-text').textContent =
      NICE_TITLES[data.status];

    if (data.progress.current === data.progress.total) {
      maximizeTerminal();
    }
  });

  socket.on('sandbox:start', () => {
    window.location.replace(`https://${sandbox}.${domain}/`);
  });

  window.addEventListener('resize', () => term.fit());

  socket.connect();
}

// start();

start();
