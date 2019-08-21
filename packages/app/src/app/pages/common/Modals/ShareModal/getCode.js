import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import {
  optionsToParameterizedUrl,
  protocolAndHost,
  sandboxUrl,
  embedUrl,
} from '@codesandbox/common/lib/utils/url-generator';
import { escapeHtml } from 'app/utils/escape';

export const BUTTON_URL = `${
  process.env.CODESANDBOX_HOST
}/static/img/play-codesandbox.svg`;

export const VIEW_OPTIONS = ['Editor + Preview', 'Preview', 'Editor'];

const getOptionsUrl = (sandbox, mainModule, state) => {
  const {
    defaultModule,
    view,
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
    options.module = modulePath;
  }

  return optionsToParameterizedUrl(options);
};

export const getEditorUrl = (sandbox, mainModule, state) =>
  protocolAndHost() +
  sandboxUrl(sandbox) +
  getOptionsUrl(sandbox, mainModule, state);

export const getEmbedUrl = (sandbox, mainModule, state) =>
  protocolAndHost() +
  embedUrl(sandbox) +
  getOptionsUrl(sandbox, mainModule, state);

export const getIframeScript = (sandbox, mainModule, state) =>
  `<iframe src="${getEmbedUrl(sandbox, mainModule, state)}" title="${escapeHtml(
    getSandboxName(sandbox)
  )}" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;

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
