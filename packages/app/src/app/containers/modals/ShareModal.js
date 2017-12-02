import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import styled from 'styled-components';
import Files from 'embed/components/Files';
import ModeIcons from 'app/components/sandbox/ModeIcons';
import {
  findMainModule,
  modulesFromSandboxSelector,
  getModulePath,
} from 'app/store/entities/sandboxes/modules/selectors';
import { singleSandboxSelector } from 'app/store/entities/sandboxes/selectors';
import { directoriesFromSandboxSelector } from 'app/store/entities/sandboxes/directories/selectors';
import {
  optionsToParameterizedUrl,
  protocolAndHost,
  sandboxUrl,
  embedUrl,
} from 'common/utils/url-generator';

import type { Sandbox, Directory, Module } from 'common/types';

import Preference from 'app/components/Preference';

const FilesContainer = styled.div`
  max-height: 300px;
  overflow: auto;
`;

const PaddedPreference = styled(Preference)`
  color: rgba(255, 255, 255, 0.6);
  padding-bottom: 1rem;

  &:last-child {
    padding-bottom: 0;
  }
`;

const ShareOptions = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  background-color: ${props => props.theme.background2};

  h3 {
    text-align: center;
    margin: 0;
    margin-bottom: 1rem;
    font-weight: 400;
  }
`;

const Inputs = styled.div`
  margin-top: 0.5rem;
  input {
    border: none;
    outline: none;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.2rem;
    margin: 0.5rem 0;
    border-radius: 4px;
  }

  textarea {
    border: none;
    outline: none;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 0.2rem;
    margin: 0.5rem 0;
    height: 100px;
    border-radius: 4px;
  }
`;

const LinkName = styled.div`
  margin: 0.5rem 0;
  font-weight: 400;
  margin-bottom: 0;
`;

const Divider = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 100%;

  color: rgba(255, 255, 255, 0.8);
  margin: 0 0.75rem;

  h4 {
    margin: 1rem 0;
    font-weight: 400;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 0.25rem;
`;

const ButtonName = styled.div`
  margin: 0.5rem 0;
  font-weight: 500;
  margin-bottom: 0;
`;

type Props = {
  sandbox: Sandbox,
  modules: Array<Module>,
  directories: Array<Directory>,
  sendMessage: (message: string) => void,
};

const BUTTON_URL = 'https://codesandbox.io/static/img/play-codesandbox.svg';

const mapStateToProps = createSelector(
  singleSandboxSelector,
  modulesFromSandboxSelector,
  directoriesFromSandboxSelector,
  (sandbox, modules, directories) => ({ modules, directories, sandbox })
);
class ShareView extends React.PureComponent {
  props: Props;

  state = {
    showEditor: true,
    showPreview: true,
    defaultModule: null,
    autoResize: false,
    hideNavigation: false,
    isCurrentModuleView: false,
    fontSize: 14,
    initialPath: '',
    useCodeMirror: false,
    enableEslint: false,
    expandDevTools: false,
  };

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

  getOptionsUrl = () => {
    const { sandbox, modules, directories } = this.props;
    const {
      defaultModule,
      showEditor,
      showPreview,
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

    const mainModuleId = findMainModule(modules, directories, sandbox.entry).id;
    if (defaultModule && defaultModule !== mainModuleId) {
      const modulePath = getModulePath(modules, directories, defaultModule);
      options.module = modulePath;
    }

    if (showEditor && !showPreview) {
      options.view = 'editor';
    }
    if (!showEditor && showPreview) {
      options.view = 'preview';
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
    const { sandbox } = this.props;

    return protocolAndHost() + sandboxUrl(sandbox) + this.getOptionsUrl();
  };

  getEmbedUrl = () => {
    const { sandbox } = this.props;

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
    const { sandbox } = this.props;
    return `[![Edit ${sandbox.title || sandbox.id}](${
      BUTTON_URL
    })](${this.getEditorUrl()})`;
  };

  // eslint-disable-next-line
  getButtonHTML = () => {
    const { sandbox } = this.props;
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

  render() {
    const { sandbox, modules, directories } = this.props;

    const {
      showEditor,
      showPreview,
      autoResize,
      hideNavigation,
      isCurrentModuleView,
      fontSize,
      initialPath,
      useCodeMirror,
      enableEslint,
      expandDevTools,
    } = this.state;

    const defaultModule =
      this.state.defaultModule ||
      findMainModule(modules, directories, sandbox.entry).id;

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
              <div
                style={{
                  position: 'relative',
                  height: '2rem',
                  width: '200px',
                  marginLeft: '-10px',
                }}
              >
                <ModeIcons
                  showEditor={showEditor}
                  showPreview={showPreview}
                  setEditorView={this.setEditorView}
                  setPreviewView={this.setPreviewView}
                  setMixedView={this.setMixedView}
                />
              </div>
            </div>
            <div>
              <h4>Default module to show</h4>

              <FilesContainer>
                <Files
                  modules={modules}
                  directoryId={null}
                  directories={directories}
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

export default connect(mapStateToProps)(ShareView);
