import { getModulePath } from 'common/sandbox/modules';
import {
  optionsToParameterizedUrl,
  protocolAndHost,
  sandboxUrl,
  embedUrl,
} from 'common/utils/url-generator';

export const BUTTON_URL = `${
  process.env.CODESANDBOX_HOST
}/static/img/play-codesandbox.svg`;

const getOptionsUrl = (sandbox, mainModule, state) => {
  const {
    defaultModule,
    showEditor,
    showPreview,
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

  const options = {};

  const mainModuleId = mainModule.id;
  if (defaultModule && defaultModule !== mainModuleId) {
    const modulePath = getModulePath(
      sandbox.modules,
      sandbox.directories,
      defaultModule
    );
    options.module = modulePath;
  }

  if (showEditor && !showPreview) {
    options.view = 'editor';
  }
  if (!showEditor && showPreview) {
    options.view = 'preview';
  }

  if (testsView) {
    options.previewwindow = 'tests';
  }

  if (autoResize) {
    options.autoresize = 1;
  }
  if (hideNavigation) {
    options.hidenavigation = 1;
  }

  if (isCurrentModuleView) {
    options.moduleview = 1;
  }

  if (enableEslint) {
    options.eslint = 1;
  }

  if (useCodeMirror) {
    options.codemirror = 1;
  }

  if (fontSize !== 14) {
    options.fontsize = fontSize;
  }

  if (initialPath) {
    options.initialpath = initialPath;
  }

  if (expandDevTools) {
    options.expanddevtools = 1;
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
  `<iframe src="${getEmbedUrl(
    sandbox,
    mainModule,
    state
  )}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;

// eslint-disable-next-line
export const getButtonMarkdown = (sandbox, mainModule, state) => {
  return `[![Edit ${sandbox.title ||
    sandbox.id}](${BUTTON_URL})](${getEditorUrl(sandbox, mainModule, state)})`;
};

// eslint-disable-next-line
export const getButtonHTML = (sandbox, mainModule, state) => {
  return `<a href="${getEditorUrl(sandbox, mainModule, state)}">
  <img alt="Edit ${sandbox.title || sandbox.id}" src="${BUTTON_URL}">
</a>
`;
};
