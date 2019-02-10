import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import Down from 'react-icons/lib/fa/angle-down';
import Right from 'react-icons/lib/fa/angle-right';
import Files from 'embed/components/Files';
import ModeIcons from 'app/components/ModeIcons';
import QRCode from 'qrcode.react';
import track from 'common/utils/analytics';
import { Spring, animated } from 'react-spring';
import { sandboxUrl } from 'common/utils/url-generator';

import {
  Title,
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
  getIframeScript,
  getEditorUrl,
  getEmbedUrl,
  getButtonMarkdown,
  getButtonHTML,
} from './getCode';

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
    links: true,
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

  select = function select(event) {
    event.target.select();
  };

  toggle = (key: string) => {
    this.setState({ [key]: !this.state[key] });
  };

  render() {
    const sandbox = this.props.store.editor.currentSandbox;
    const mainModule = this.props.store.editor.mainModule;
    console.log(sandbox);
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
              <Title onClick={() => this.toggle('appearance')}>
                {this.state.appearance ? <Right /> : <Down />}Appearance
              </Title>
              <Spring
                from={{ height: 'auto' }}
                to={{
                  height: this.state.appearance ? 'auto' : 0,
                  overflow: 'hidden',
                }}
              >
                {props => (
                  <animated.div style={props}>
                    <Inputs
                      css={`
                        position: relative;
                        padding-bottom: 1.25rem;
                      `}
                    >
                      <span>Default View</span>
                      <div
                        css={`
                          > div {
                            left: auto;

                            > div {
                              height: 1rem;
                              width: 1.25rem;
                            }
                          }
                        `}
                      >
                        <ModeIcons
                          showEditor={showEditor}
                          showPreview={showPreview}
                          setEditorView={this.setEditorView}
                          setPreviewView={this.setPreviewView}
                          setMixedView={this.setMixedView}
                        />
                      </div>
                    </Inputs>
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
                  </animated.div>
                )}
              </Spring>
              <Title onClick={() => this.toggle('sandboxOptions')}>
                {this.state.sandboxOptions ? <Right /> : <Down />}Sandbox
                Options
              </Title>
              <Spring
                from={{ height: 'auto' }}
                to={{
                  height: this.state.sandboxOptions ? 'auto' : 0,
                  overflow: 'hidden',
                }}
              >
                {props => (
                  <animated.div style={props}>
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
                  </animated.div>
                )}
              </Spring>
              <Title onClick={() => this.toggle('otherOptions')}>
                {this.state.otherOptions ? <Right /> : <Down />}Other Options
              </Title>
              <Spring
                from={{ height: 'auto' }}
                to={{
                  height: this.state.otherOptions ? 'auto' : 0,
                  overflow: 'hidden',
                }}
              >
                {props => (
                  <animated.div style={props}>
                    <Inputs>
                      <LinkName>Project Initial Path</LinkName>
                      <input
                        onFocus={this.select}
                        placeholder="e.g: /home"
                        value={initialPath}
                        onChange={this.setInitialPath}
                      />
                    </Inputs>
                  </animated.div>
                )}
              </Spring>
            </section>
            <section>
              <SideTitle>Share</SideTitle>
              <Title onClick={() => this.toggle('links')}>
                {this.state.links ? <Right /> : <Down />}Share embed
              </Title>
              <Spring
                from={{ height: 'auto' }}
                to={{
                  height: this.state.links ? 'auto' : 0,
                  overflow: 'hidden',
                }}
              >
                {props => (
                  <animated.div style={props}>
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
                  </animated.div>
                )}
              </Spring>
              <Title onClick={() => this.toggle('buttons')}>
                {this.state.buttons ? <Right /> : <Down />}Share CodeSandbox
                Button
              </Title>
              <Spring
                from={{ height: 'auto' }}
                to={{
                  height: this.state.buttons ? 'auto' : 0,
                  overflow: 'hidden',
                }}
              >
                {props => (
                  <animated.div style={props}>
                    <Inputs>
                      <ButtonContainer>
                        <a href={sandboxUrl(sandbox)}>
                          <img
                            alt={sandbox.title || 'Untitled'}
                            src={BUTTON_URL}
                          />
                        </a>
                      </ButtonContainer>
                    </Inputs>
                    <Inputs>
                      <LinkName>Markdown</LinkName>
                      <textarea
                        onFocus={this.select}
                        value={getButtonMarkdown(
                          sandbox,
                          mainModule,
                          this.state
                        )}
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
                  </animated.div>
                )}
              </Spring>
              <Title onClick={() => this.toggle('qr')}>
                {this.state.qr ? <Right /> : <Down />}Share QR code
              </Title>
              <Spring
                from={{ height: 'auto' }}
                to={{
                  height: this.state.qr ? 'auto' : 0,
                  overflow: 'hidden',
                }}
              >
                {props => (
                  <animated.div style={props}>
                    <Inputs>
                      <QRCode
                        value={getEmbedUrl(sandbox, mainModule, this.state)}
                        size={'100%'}
                        renderAs="svg"
                      />
                    </Inputs>
                  </animated.div>
                )}
              </Spring>
            </section>
          </Wrapper>
        </ShareOptions>
      </Fragment>
    );
  }
}

export default inject('store', 'signals')(observer(ShareView));
