import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import {
  embedUrl,
  optionsToParameterizedUrl,
  protocolAndHost,
  sandboxUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { escapeHtml } from 'app/utils/escape';

export const BUTTON_URL = `${process.env.CODESANDBOX_HOST}/static/img/play-codesandbox.svg`;

export const VIEW_OPTIONS = ['Editor + Preview', 'Preview', 'Editor'];
const THEME_OPTIONS = ['Dark', 'Light'];

const getOptionsUrl = (sandbox, mainModule, state) => {
  const {
    defaultModule,
    view,
    theme,
    testsView,
    autoResize,
    hideNavigation,
    isCurrentModuleView,
    fontSize,
    initialPath,
    enableEslint,
    useCodeMirror,
    expandDevTools,
  } = state;

  const options = {
    view: view !== VIEW_OPTIONS[0] ? view.toLowerCase() : null,
    theme: theme !== THEME_OPTIONS[0] ? theme.toLowerCase() : null,
    previewwindow: testsView ? 'tests' : null,
    autoresize: autoResize ? 1 : null,
    hidenavigation: hideNavigation ? 1 : null,
    moduleview: isCurrentModuleView ? 1 : null,
    eslint: enableEslint ? 1 : null,
    codemirror: useCodeMirror ? 1 : null,
    expanddevtools: expandDevTools ? 1 : null,
    fontsize: fontSize !== 14 ? fontSize : 14,
    initialpath: initialPath || null,
  };

  const mainModuleId = mainModule.id;
  if (defaultModule && defaultModule !== mainModuleId) {
    const modulePath = getModulePath(
      sandbox.modules,
      sandbox.directories,
      defaultModule
    );
    // @ts-ignore
    options.module = modulePath;
  }

  return optionsToParameterizedUrl(options);
};

const getEditorUrl = (sandbox, mainModule, state) =>
  protocolAndHost() +
  sandboxUrl(sandbox) +
  getOptionsUrl(sandbox, mainModule, state);

export const getEmbedUrl = (sandbox, mainModule, state) =>
  protocolAndHost() +
  embedUrl(sandbox) +
  getOptionsUrl(sandbox, mainModule, state);

export const getIframeScript = (sandbox, mainModule, state, height) =>
  `<iframe src="${getEmbedUrl(sandbox, mainModule, state)}"
     style="width:100%; height:${height}px; border:0; border-radius: 4px; overflow:hidden;"
     title="${escapeHtml(getSandboxName(sandbox))}"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts allow-downloads allow-pointer-lock"
   ></iframe>`;

// eslint-disable-next-line
export const getButtonMarkdown = (sandbox, mainModule, state) => {
  return `[![Edit ${getSandboxName(sandbox)}](${BUTTON_URL})](${getEditorUrl(
    sandbox,
    mainModule,
    state
  )})`;
};

// eslint-disable-next-line
export const getButtonHTML = (sandbox, mainModule, state) => {
  return `<a href="${getEditorUrl(sandbox, mainModule, state)}">
  <img alt="Edit ${sandbox.title || sandbox.id}" src="${BUTTON_URL}">
</a>
`;
};

export const getDevToLink = sandbox =>
  `https://dev.to/new?prefill=---%5Cn%20title:${encodeURIComponent(
    sandbox.title || sandbox.id
  )}%5Cn%20published:%20false%5Cn%20tags:%20codesandbox%5Cn%20---%5Cn%20%5Cn%20%5Cn%20%5Cn%20%7B%25%20codesandbox%20${encodeURIComponent(
    sandbox.id
  )}%20%25%7D`;

export const getTwitterLink = (sandbox, mainModule, state) =>
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${sandbox.title || sandbox.id}. ${getEditorUrl(
      sandbox,
      mainModule,
      state
    )}`
  )}`;
