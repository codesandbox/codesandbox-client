function getExternalResourcesConcatination(resources: Array<string>) {
  return resources.sort().join('');
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
  script.setAttribute('id', 'external-js');
  document.head.appendChild(script);
}

function addResource(resource: string) {
  const kind = resource.match(/\.([^.]*)$/)[1];

  if (kind === 'css') {
    addCSS(resource);
  } else if (kind === 'js') {
    addJS(resource);
  }
}

let cachedExternalResources = '';

export default function handelExternalResources(externalResources) {
  const extResString = getExternalResourcesConcatination(externalResources);
  if (extResString !== cachedExternalResources) {
    clearExternalResources();
    externalResources.forEach(addResource);
    cachedExternalResources = extResString;
  }
}
