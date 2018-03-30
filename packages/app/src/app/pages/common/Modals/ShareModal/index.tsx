import * as React from 'react';
import { connect } from 'app/fluent';
import Files from 'embed/components/Files';
import ModeIcons from 'app/components/ModeIcons';
import { getModulePath } from 'common/sandbox/modules';
import QRCode from 'qrcode.react';
import Button from 'app/components/Button';

import { optionsToParameterizedUrl, protocolAndHost, sandboxUrl, embedUrl } from 'common/utils/url-generator';

import {
    FilesContainer,
    PaddedPreference,
    ShareOptions,
    Inputs,
    LinkName,
    Divider,
    Column,
    ButtonContainer,
    ButtonName
} from './elements';

const BUTTON_URL = `${process.env.CODESANDBOX_HOST}/static/img/play-codesandbox.svg`;

type Options = {
    module?: string;
    view?: string;
    autoresize?: number;
    hidenavigation?: number;
    moduleview?: number;
    eslint?: number;
    codemirror?: number;
    fontsize?: number;
    initialpath?: string;
    expanddevtools?: number;
};

type Props = {
    sendMessage: (message: string) => void;
};

type InternalState = {
    message: string;
    showEditor: boolean;
    showPreview: boolean;
    defaultModule: any;
    autoResize: boolean;
    hideNavigation: boolean;
    isCurrentModuleView: boolean;
    fontSize: number;
    initialPath: string;
    useCodeMirror: boolean;
    enableEslint: boolean;
    expandDevTools: boolean;
    showQRCode: boolean;
};

export default connect<Props>()
    .with(({ state }) => ({
        currentSandbox: state.editor.currentSandbox,
        mainModule: state.editor.mainModule
    }))
    .toClass(
        (props) =>
            class ShareView extends React.Component<typeof props, InternalState> {
                state: InternalState = {
                    showEditor: true,
                    showPreview: true,
                    message: '',
                    defaultModule: null,
                    autoResize: false,
                    hideNavigation: false,
                    isCurrentModuleView: false,
                    fontSize: 14,
                    initialPath: '',
                    useCodeMirror: false,
                    enableEslint: false,
                    expandDevTools: false,
                    showQRCode: false
                };

                handleChange = (e) => this.setState({ message: e.target.value });

                handleSend = () => {
                    if (this.state.message !== '') {
                        this.props.sendMessage(this.state.message);
                        this.setState({ message: '' });
                    }
                };

                setEditorView = () => this.setState({ showEditor: true, showPreview: false });
                setPreviewView = () => this.setState({ showEditor: false, showPreview: true });
                setMixedView = () => this.setState({ showEditor: true, showPreview: true });

                setDefaultModule = (id) => this.setState({ defaultModule: id });

                clearDefaultModule = () => this.setState({ defaultModule: null });

                toggleQRCode = () => this.setState({ showQRCode: !this.state.showQRCode });

                getOptionsUrl = () => {
                    const sandbox = this.props.currentSandbox;
                    const mainModule = this.props.mainModule;
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
                        expandDevTools
                    } = this.state;

                    const options: Options = {};

                    const mainModuleId = mainModule.id;
                    if (defaultModule && defaultModule !== mainModuleId) {
                        const modulePath = getModulePath(sandbox.modules, sandbox.directories, defaultModule);
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
                    const sandbox = this.props.currentSandbox;

                    return protocolAndHost() + sandboxUrl(sandbox) + this.getOptionsUrl();
                };

                getEmbedUrl = () => {
                    const sandbox = this.props.currentSandbox;

                    return protocolAndHost() + embedUrl(sandbox) + this.getOptionsUrl();
                };

                setInitialPath = ({ target }) => {
                    const initialPath = target.value;
                    this.setState({ initialPath });
                };

                getIframeScript = () =>
                    // tslint:disable-next-line
                    `<iframe src="${this.getEmbedUrl()}" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;

                select = function select(event) {
                    event.target.select();
                };

                // eslint-disable-next-line
                getButtonMarkdown = () => {
                    const sandbox = this.props.currentSandbox;
                    return `[![Edit ${sandbox.title || sandbox.id}](${BUTTON_URL})](${this.getEditorUrl()})`;
                };

                // eslint-disable-next-line
                getButtonHTML = () => {
                    const sandbox = this.props.currentSandbox;
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

                setFontSize = (fontSize: number) => [ this.setState({ fontSize }) ];

                render() {
                    const sandbox = this.props.currentSandbox;
                    const mainModule = this.props.mainModule;

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
                        showQRCode
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
                                                marginLeft: '-10px'
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
                                        <input onFocus={this.select} value={this.getEditorUrl()} readOnly />
                                        <LinkName>Embed url</LinkName>
                                        <input onFocus={this.select} value={this.getEmbedUrl()} readOnly />
                                        <LinkName>iframe</LinkName>
                                        <textarea onFocus={this.select} value={this.getIframeScript()} readOnly />
                                        <LinkName>QR Code</LinkName>
                                        <Inputs>
                                            <ButtonContainer>
                                                <Button onClick={this.toggleQRCode} small style={{ width: '100%' }}>
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
                                        <textarea onFocus={this.select} value={this.getButtonMarkdown()} readOnly />

                                        <LinkName>HTML</LinkName>
                                        <textarea onFocus={this.select} value={this.getButtonHTML()} readOnly />
                                    </Inputs>
                                </Column>
                            </Divider>
                        </ShareOptions>
                    );
                }
            }
    );
