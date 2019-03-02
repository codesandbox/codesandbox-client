import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import Files from 'embed/components/Files';
import QRCode from 'qrcode.react';
import track from 'common/lib/utils/analytics';
import { sandboxUrl } from 'common/lib/utils/url-generator';
import Title from './Title';

import {
  FilesContainer,
  Wrapper,
  PaddedPreference,
  ShareOptions,
  Inputs,
  LinkName,
  SideTitle,
  ButtonContainer,
} from './elements';

import {
  BUTTON_URL,
  VIEW_OPTIONS,
  getIframeScript,
  getEditorUrl,
  getEmbedUrl,
  getButtonMarkdown,
  getButtonHTML,
} from './getCode';

class ShareView extends React.Component {
  state = {
    view: VIEW_OPTIONS[0],
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

  setInitialPath = ({ target }) => {
    const initialPath = target.value;
    this.setState({ initialPath });
  };

  setView = (view: string) => {
    this.setState({ view });
  };

  select = function select(event) {
    event.target.select();
  };

  toggle = (key: string) => {
    this.setState({ [key]: !this.state[key] });
  };

  render() {
    const sandbox = this.props.store.editor.currentSandbox;
    const mainModule = this.props.store.editor.mainModule;

    const {
      view,
      testsView,
      autoResize,
      hideNavigation,
      isCurrentModuleView,
      fontSize,
      initialPath,
      useCodeMirror,
      enableEslint,
      expandDevTools,
    } = this.state;

    const defaultModule = this.state.defaultModule || mainModule.id;

    return (
      <Fragment>
        <header
          // eslint-disable-next-line
          dangerouslySetInnerHTML={{
            __html: getIframeScript(sandbox, mainModule, this.state),
          }}
        />

        <ShareOptions>
          <Wrapper>
            <section>
              <SideTitle>Configure</SideTitle>
              <Title title="Appearance">
                <PaddedPreference
                  title="Default View"
                  type="dropdown"
                  options={VIEW_OPTIONS}
                  value={view}
                  setValue={this.setView}
                />
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
              </Title>
              <Title title="Sandbox Options">
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
              </Title>
              <Title title="Other Options">
                <Inputs>
                  <LinkName>Project Initial Path</LinkName>
                  <input
                    onFocus={this.select}
                    placeholder="e.g: /home"
                    value={initialPath}
                    onChange={this.setInitialPath}
                  />
                </Inputs>
              </Title>
            </section>
            <section>
              <SideTitle>Share</SideTitle>
              <Title title="Share embed" open>
                <Inputs>
                  <LinkName>Editor url (also works on Medium)</LinkName>
                  <input
                    onFocus={this.select}
                    value={getEditorUrl(sandbox, mainModule, this.state)}
                    readOnly
                  />
                </Inputs>
                <Inputs>
                  <LinkName>Embed url</LinkName>
                  <input
                    onFocus={this.select}
                    value={getEmbedUrl(sandbox, mainModule, this.state)}
                    readOnly
                  />
                </Inputs>
                <Inputs>
                  <LinkName>iframe</LinkName>
                  <textarea
                    onFocus={this.select}
                    value={getIframeScript(sandbox, mainModule, this.state)}
                    readOnly
                  />
                </Inputs>
              </Title>
              <Title title="Share CodeSandbox Button">
                <Inputs>
                  <ButtonContainer>
                    <a href={sandboxUrl(sandbox)}>
                      <img alt={sandbox.title || 'Untitled'} src={BUTTON_URL} />
                    </a>
                  </ButtonContainer>
                </Inputs>
                <Inputs>
                  <LinkName>Markdown</LinkName>
                  <textarea
                    onFocus={this.select}
                    value={getButtonMarkdown(sandbox, mainModule, this.state)}
                    readOnly
                  />
                </Inputs>
                <Inputs>
                  <LinkName>HTML</LinkName>
                  <textarea
                    onFocus={this.select}
                    value={getButtonHTML(sandbox, mainModule, this.state)}
                    readOnly
                  />
                </Inputs>
              </Title>
              <Title title="Share QR code">
                <Inputs>
                  <QRCode
                    value={getEmbedUrl(sandbox, mainModule, this.state)}
                    size={'100%'}
                    renderAs="svg"
                  />
                </Inputs>
              </Title>
            </section>
          </Wrapper>
        </ShareOptions>
      </Fragment>
    );
  }
}

export default inject('store', 'signals')(observer(ShareView));
