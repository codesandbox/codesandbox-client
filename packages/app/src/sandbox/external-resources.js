function getExternalResourcesConcatenation(resources: Array<string>) {
  return resources.join('');
}

function clearExternalResources() {
  let el = null;
  while ((el = document.getElementById('external-css'))) {
    el.remove();
  }

  while ((el = document.getElementById('external-js'))) {
    el.remove();
  }
}

function addCSS(resource: string) {
  const head = document.getElementsByTagName('head')[0];
  const link = document.createElement('link');
  link.id = 'external-css';
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = resource;
  link.media = 'all';
  head.appendChild(link);
}

function addJS(resource: string) {
  const script = document.createElement('script');
  script.setAttribute('src', resource);
  script.async = false;
  script.setAttribute('id', 'external-js');
  document.head.appendChild(script);
}

function addResource(resource: string) {
  const match = resource.match(/\.([^.]*)$/);

  if (match && match[1] === 'css') {
    addCSS(resource);
  } else {
    addJS(resource);
  }
}

let cachedExternalResources = '';

export default function handleExternalResources(externalResources) {
  const extResString = getExternalResourcesConcatenation(externalResources);
  if (extResString !== cachedExternalResources) {
    clearExternalResources();
    externalResources.forEach(addResource);
    cachedExternalResources = extResString;
  }
}
