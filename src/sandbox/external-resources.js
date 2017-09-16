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

// http://2ality.com/2011/08/javascript-media-type.html
const JS_MEDIA_TYPES = [
  'application/ecmascript',
  'application/javascript',
  'application/x-ecmascript',
  'application/x-javascript',
  'text/ecmascript',
  'text/javascript',
  'text/javascript1.0',
  'text/javascript1.1',
  'text/javascript1.2',
  'text/javascript1.3',
  'text/javascript1.4',
  'text/javascript1.5',
  'text/jscript',
  'text/livescript',
  'text/x-ecmascript',
  'text/x-javascript',
];
function isJSContentType(contentType: string) {
  return JS_MEDIA_TYPES.some(t => contentType.indexOf(t) === 0);
}

function getContentType(resource: string) {
  return fetch(resource, {
    method: 'HEAD',
    mode: 'cors',
  }).then(response => response.headers.get('Content-Type'));
}

function addJS(resource: string) {
  const script = document.createElement('script');
  script.setAttribute('src', resource);
  script.async = false;
  script.setAttribute('id', 'external-js');
  document.head.appendChild(script);
}

export async function addResource(
  resource: string,
  addCSS = addCSS,
  addJS = addJS,
  getContentType = getContentType
) {
  const match = resource.match(/\.([^.]*)$/);

  if (match && match[1] === 'css') {
    addCSS(resource);
  } else if (match && match[1] === 'js') {
    addJS(resource);
  } else {
    try {
      const contentType = await getContentType(resource);
      if (contentType.indexOf('text/css') === 0) {
        addCSS(resource);
      } else if (isJSContentType(contentType)) {
        addJS(resource);
      } else {
        throw new Error(`Unsupported Content-Type: ${contentType}`);
      }
    } catch (e) {
      if (e.message === 'Failed to fetch') {
        e.name = 'ResourceNotFound';
        e.message = `Could not fetch '${resource}'`;
      }
      throw e;
    }
  }
}

let cachedExternalResources = '';

export default async function handleExternalResources(externalResources) {
  const extResString = getExternalResourcesConcatenation(externalResources);
  if (extResString !== cachedExternalResources) {
    clearExternalResources();
    await Promise.all(
      externalResources.map(resource =>
        addResource(resource, addCSS, addJS, getContentType)
      )
    );
    cachedExternalResources = extResString;
  }
}
