import React from 'react';
import { inject, observer } from 'mobx-react';
import Files from 'embed/components/Files';
import ModeIcons from 'app/components/ModeIcons';
import { getModulePath } from 'common/sandbox/modules';
import QRCode from 'qrcode.react';
import Button from 'app/components/Button';
import track from 'common/utils/analytics';

import {
  optionsToParameterizedUrl,
  protocolAndHost,
  sandboxUrl,
  embedUrl,
} from 'common/utils/url-generator';

import {
  FilesContainer,
  PaddedPreference,
  ShareOptions,
  Inputs,
  LinkName,
  Divider,
  Column,
  ButtonContainer,
  ButtonName,
  Container,
} from './elements';

const BUTTON_URL = `${
  process.env.CODESANDBOX_HOST
}/static/img/play-codesandbox.svg`;

class ShareView extends React.Component {
  state = {
    showEditor: true,
    showPreview: true,
    testsView: false,
    defaultModule: null,
    autoResize: false,
    hideNavigation: false,
    isCurrentModuleView: false,
    fontSize: 14,
    initialPath: '',
    useCodeMirror: false,
    enableEslint: false,
    expandDevTools: false,
    showQRCode: false,
  };

  componentDidMount() {
    track('Share Modal Opened', {});
  }

  handleChange = e => this.setState({ message: e.target.value });

  handleSend = () => {
    if (this.state.message !== '') {
      this.toggle();
      this.props.sendMessage(this.state.message);
      this.setState({ message: '' });
    }
  };

  setEditorView = () => this.setState({ showEditor: true, showPreview: false });
  setPreviewView = () =>
    this.setState({ showEditor: false, showPreview: true });
  setMixedView = () => this.setState({ showEditor: true, showPreview: true });

  setDefaultModule = id => this.setState({ defaultModule: id });

  clearDefaultModule = () => this.setState({ defaultModule: null });

  toggleQRCode = () => this.setState({ showQRCode: !this.state.showQRCode });

  getOptionsUrl = () => {
    const sandbox = this.props.store.editor.currentSandbox;
    const mainModule = this.props.store.editor.mainModule;
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
    } = this.state;

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

  getEditorUrl = () => {
    const sandbox = this.props.store.editor.currentSandbox;

    return protocolAndHost() + sandboxUrl(sandbox) + this.getOptionsUrl();
  };

  getEmbedUrl = () => {
    const sandbox = this.props.store.editor.currentSandbox;

    return protocolAndHost() + embedUrl(sandbox) + this.getOptionsUrl();
  };

  setInitialPath = ({ target }) => {
    const initialPath = target.value;
    this.setState({ initialPath });
  };

  getIframeScript = () =>
    `<iframe src="${this.getEmbedUrl()}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;

  select = function select(event) {
    event.target.select();
  };

  // eslint-disable-next-line
  getButtonMarkdown = () => {
    const sandbox = this.props.store.editor.currentSandbox;
    return `[![Edit ${sandbox.title ||
      sandbox.id}](${BUTTON_URL})](${this.getEditorUrl()})`;
  };

  // eslint-disable-next-line
  getButtonHTML = () => {
    const sandbox = this.props.store.editor.currentSandbox;
    return `<a href="${this.getEditorUrl()}">
  <img alt="Edit ${sandbox.title || sandbox.id}" src="${BUTTON_URL}">
</a>
`;
  };

  setAutoResize = (autoResize: boolean) => {
    this.setState({ autoResize });
  };

  setHideNavigation = (hideNavigation: boolean) => {
    this.setState({ hideNavigation });
  };

  setUseCodeMirror = (useCodeMirror: boolean) => {
    this.setState({ useCodeMirror });
  };

  setEnableEslint = (enableEslint: boolean) => {
    this.setState({ enableEslint });
  };

  setIsCurrentModuleView = (isCurrentModuleView: boolean) => {
    this.setState({ isCurrentModuleView });
  };

  setExpandDevTools = (expandDevTools: boolean) => {
    this.setState({ expandDevTools });
  };

  setFontSize = (fontSize: number) => [this.setState({ fontSize })];

  setTestsView = (testsView: boolean) => {
    this.setState({ testsView });
  };

  render() {
    const sandbox = this.props.store.editor.currentSandbox;
    const mainModule = this.props.store.editor.mainModule;

    const {
      showEditor,
      showPreview,
      testsView,
      autoResize,
      hideNavigation,
      isCurrentModuleView,
      fontSize,
      initialPath,
      useCodeMirror,
      enableEslint,
      expandDevTools,
      showQRCode,
    } = this.state;

    const defaultModule = this.state.defaultModule || mainModule.id;

    return (
      <ShareOptions>
        <h3>Share options</h3>
        <Divider>
          <Column>
            <ButtonName>URL Options</ButtonName>
            <div>
              <h4>Embed specific options</h4>
              <PaddedPreference
                title="Auto resize"
                type="boolean"
                tooltip="Works only on Medium"
                value={autoResize}
                setValue={this.setAutoResize}
              />
              <PaddedPreference
                title="Hide navigation bar"
                type="boolean"
                value={hideNavigation}
                setValue={this.setHideNavigation}
              />
              <PaddedPreference
                title="Expand console"
                type="boolean"
                value={expandDevTools}
                setValue={this.setExpandDevTools}
              />
              <PaddedPreference
                title="Use CodeMirror instead of Monaco editor"
                type="boolean"
                value={useCodeMirror}
                setValue={this.setUseCodeMirror}
              />
              <PaddedPreference
                title="Enable eslint (significantly higher bundle size)"
                type="boolean"
                value={enableEslint}
                setValue={this.setEnableEslint}
              />
              <PaddedPreference
                title="Show current module view"
                type="boolean"
                tooltip="Only show the module that's currently open"
                value={isCurrentModuleView}
                setValue={this.setIsCurrentModuleView}
              />
              <PaddedPreference
                title="Show Tests (instead of browser preview)"
                type="boolean"
                value={testsView}
                setValue={this.setTestsView}
              />
              <PaddedPreference
                title="Font size"
                type="number"
                value={fontSize}
                setValue={this.setFontSize}
              />
            </div>
            <Inputs>
              <LinkName>Project Initial Path</LinkName>
              <input
                onFocus={this.select}
                placeholder="e.g: /home"
                value={initialPath}
                onChange={this.setInitialPath}
              />
            </Inputs>
            <div>
              <h4>Default view</h4>
              <Container>
                <ModeIcons
                  showEditor={showEditor}
                  showPreview={showPreview}
                  setEditorView={this.setEditorView}
                  setPreviewView={this.setPreviewView}
                  setMixedView={this.setMixedView}
                />
              </Container>
            </div>
            <div>
              <h4>Default module to show</h4>

              <FilesContainer>
                <Files
                  modules={sandbox.modules}
                  directoryId={null}
                  directories={sandbox.directories}
                  currentModule={defaultModule}
                  setCurrentModule={this.setDefaultModule}
                />
              </FilesContainer>
            </div>
          </Column>
          <Column>
            <ButtonName>Links</ButtonName>
            <Inputs>
              <LinkName>Editor url (also works on Medium)</LinkName>
              <input
                onFocus={this.select}
                value={this.getEditorUrl()}
                readOnly
              />
              <LinkName>Embed url</LinkName>
              <input
                onFocus={this.select}
                value={this.getEmbedUrl()}
                readOnly
              />
              <LinkName>iframe</LinkName>
              <textarea
                onFocus={this.select}
                value={this.getIframeScript()}
                readOnly
              />
              <LinkName>QR Code</LinkName>
              <Inputs>
                <ButtonContainer>
                  <Button
                    onClick={this.toggleQRCode}
                    small
                    css={`
                      width: 100%;
                    `}
                  >
                    {showQRCode ? 'Hide' : 'Show'} QR Code
                  </Button>
                  {showQRCode && (
                    <Inputs>
                      <QRCode
                        value={this.getEmbedUrl()}
                        size={'100%'}
                        renderAs="svg"
                      />
                    </Inputs>
                  )}
                </ButtonContainer>
              </Inputs>
            </Inputs>
          </Column>
          <Column>
            <ButtonName>Button</ButtonName>
            <Inputs>
              <ButtonContainer>
                <a href={sandboxUrl(sandbox)}>
                  <img alt={sandbox.title || 'Untitled'} src={BUTTON_URL} />
                </a>
              </ButtonContainer>
              <LinkName>Markdown</LinkName>
              <textarea
                onFocus={this.select}
                value={this.getButtonMarkdown()}
                readOnly
              />

              <LinkName>HTML</LinkName>
              <textarea
                onFocus={this.select}
                value={this.getButtonHTML()}
                readOnly
              />
            </Inputs>
          </Column>
        </Divider>
      </ShareOptions>
    );
  }
}

export default inject('store', 'signals')(observer(ShareView));
