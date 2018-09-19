import io from 'socket.io-client';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import * as WebfontLoader from 'xterm-webfont';
import 'xterm/dist/xterm.css';

const rootDomain = document.location.host;
const domain = `sse.${rootDomain}`;
const { host } = window.location;
const sandbox = host !== 'localhost' ? host.split('.')[0] : 'gatsby';
let loading = 0;
let loadingTimer;

fetch(`https://${rootDomain}/api/v1/sandboxes/${sandbox}/version`).then(res => {
  if (res.status === 404) {
    window.location.replace(`https://notfound.sse.${domain}/`);
  }
});

function showLoading(term) {
  term.write(
    `Starting server sandbox (this might take a few seconds)${'.'.repeat(
      loading
    )}   \r`
  );
  loading = loading + 1 > 3 ? 0 : loading + 1;
  loadingTimer = setTimeout(showLoading, 500, term);
}

async function start() {
  const el = document.getElementById('term');

  Terminal.applyAddon(fit);
  Terminal.applyAddon(WebfontLoader);

  const term = new Terminal({
    // fontFamily: 'Inconsolata',
    fontSize: 16,
  });

  term.setOption('theme', {
    background: '#635541',
  });

  el.innerHTML = '';
  term.open(el);

  term.fit();
  showLoading(term);

  const socket = io(`https://${domain}`, {
    autoConnect: false,
  });

  socket.on('connect', () => {
    socket.emit('sandbox', { id: sandbox });
    socket.emit('sandbox:start');
  });

  socket.on('sandbox:log', ({ chan, data }) => {
    if (loadingTimer) {
      clearTimeout(loadingTimer);
      loadingTimer = null;
      term.write('\n');
    }
    term.write(data);
  });

  socket.on('sandbox:start', () => {
    window.location.replace(`https://${sandbox}.${domain}/`);
  });

  window.addEventListener('resize', () => term.fit());

  socket.connect();
}

start();
