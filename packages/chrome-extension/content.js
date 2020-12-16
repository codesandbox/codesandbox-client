// CodeSandbox Logo
const SVG = `
<svg width="20" height="17" viewBox="0 0 222 252" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.21906 55.4205L104.143 2.63078C109.425 -0.246393 115.823 -0.172544 121.038 2.8258L214.465 56.5439C218.759 59.0125 221.405 63.5875 221.405 68.5401V182.652C221.405 187.615 218.747 192.199 214.438 194.663L117.637 250.034C113.346 252.488 108.072 252.467 103.8 249.979L6.87245 193.515C2.61721 191.036 0 186.483 0 181.558V67.5728C0 62.5058 2.76932 57.8441 7.21906 55.4205Z" fill="#151515"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M110.695 126.451V235.33C112.591 235.33 113.837 234.919 115.539 233.947L202.722 184.128C206.163 182.156 207.567 179.101 207.567 175.133V74.1121C207.567 72.1218 207.148 70.931 206.181 69.2687L113.484 121.645C111.76 122.63 110.695 124.465 110.695 126.451ZM159.13 188.972C159.13 191.739 158.093 193.123 155.67 194.507L126.609 211.113C124.534 212.496 121.766 211.805 121.766 209.037V135.001C121.766 133.021 123.509 130.454 125.225 129.466L191.651 91.4103C193.496 90.3484 195.11 92.0491 195.11 94.178V133.618C195.11 135.662 194.146 137.499 192.342 138.461L162.59 154.375C160.786 155.337 159.13 157.174 159.13 159.219V188.972Z" fill="#999999"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M13.8252 175.131V74.1108C13.8252 70.138 15.9113 66.395 19.3606 64.4238L103.775 16.6811C105.594 15.7173 108.618 15.2973 110.695 15.2973C112.771 15.2973 115.973 15.8114 117.614 16.6811L201.337 64.4238C202.993 65.4026 205.243 67.6571 206.18 69.2674L113.462 121.854C111.738 122.839 110.695 124.711 110.695 126.697V235.329C108.799 235.329 106.861 234.917 105.159 233.945L20.0525 184.819C16.6031 182.847 13.8252 179.104 13.8252 175.131ZM26.2798 94.1766V133.616C26.2798 136.384 26.9718 137.768 29.7395 139.152L58.8003 155.758C61.5679 157.142 62.2599 159.217 62.2599 161.293V188.97C62.2599 191.737 62.9518 193.121 65.7195 194.506L94.7803 211.112C97.5477 212.496 99.6238 211.804 99.6238 209.036V135.001C99.6238 132.924 98.9318 130.848 96.1646 129.465L31.1233 92.1008C29.0475 90.717 26.2798 91.4089 26.2798 94.1766ZM139.756 47.1258L114.154 61.6561C112.079 63.04 109.311 63.04 107.235 61.6561L81.6337 47.1258C79.9485 46.1733 77.7863 46.1781 76.0983 47.1258L44.2699 65.1158C41.5022 66.4997 41.5022 69.2674 44.2699 70.6512L107.926 107.323C109.63 108.298 111.759 108.298 113.462 107.323L177.119 70.6512C179.195 69.2674 179.887 66.4997 177.119 65.1158L145.291 47.1258C143.603 46.1781 141.441 46.1733 139.756 47.1258Z" fill="#F2F2F2"/>
</svg>
`;

const addButton = () => {
  // Get the toolbar
  const toolbar = document.querySelector('.file-navigation');

  if (!toolbar) {
    return
  }

  // Get everything after https://github.com/
  const URL = window.location.pathname;

  // Create the button
  const button = document.createElement('a');
  button.setAttribute('href', `https://codesandbox.io/s/github${URL}`);
  button.setAttribute('target', '_blank');
  button.setAttribute('rel', 'noopener noreferrer');

  button.classList.add('btn', 'ml-2', 'open-codesanbox-chrome-extension');
  button.innerHTML = `
  ${SVG}
  Open Sandbox
`;

  // Add it to the DOM
  toolbar.querySelector('get-repo').parentElement.before(button);
};
addButton();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request)
  if (request.type === "screenshot") {
    screenshot();
  } else if (request.type === "screenshot-taken") {
    window.postMessage({
      type: 'extension-screenshot-taken',
      url: request.url
    })
  }

  sendResponse({});
});

function send(request) {
  chrome.runtime.sendMessage(request, function (response) { });
}

function screenshot() {
  const preview = document.querySelector('#sandbox-preview')
  const bounds = preview.getBoundingClientRect()

  send({
    type: "screenshot",
    bounds: {
      left: bounds.left * window.devicePixelRatio,
      top: bounds.top * window.devicePixelRatio,
      width: bounds.width * window.devicePixelRatio,
      height: bounds.height * window.devicePixelRatio
    }
  })
}

window.addEventListener('message', (event) => {
  if (event.source !== window)
    return

  if (event.data.type === 'extension-ping') {
    window.postMessage({
      type: 'extension-pong'
    })
  } else if (event.data.type === 'extension-screenshot') {
    screenshot()
  }
})