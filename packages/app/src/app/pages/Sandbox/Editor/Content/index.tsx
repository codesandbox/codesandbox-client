import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { Prompt } from 'react-router-dom';
import { reaction } from 'mobx';
import { connect } from 'app/fluent';
import getTemplateDefinition from 'common/templates';

import CodeEditor from 'app/components/CodeEditor';
import DevTools from 'app/components/Preview/DevTools';
import FilePath from 'app/components/CodeEditor/FilePath';
import Preview from './Preview';

import Tabs from './Tabs';

import { FullSize } from './elements';

type State = {
    width?: number;
    height?: number;
};

export default connect()
    .with(({ state, signals }) => ({
        currentSandbox: state.editor.currentSandbox,
        currentModule: state.editor.currentModule,
        isAllModulesSynced: state.editor.isAllModulesSynced,
        isForkingSandbox: state.editor.isForkingSandbox,
        zenMode: state.preferences.settings.zenMode,
        showDevtools: state.preferences.showDevtools,
        previewWindow: state.editor.previewWindow,
        workspace: state.workspace,
        editor: state.editor,
        preferences: state.preferences,
        openedWorkspaceItem: state.workspace.openedWorkspaceItem,
        errors: state.editor.errors,
        corrections: state.editor.corrections,
        glyphs: state.editor.glyphs,
        parsedConfigurations: state.editor.parsedConfigurations,
        settings: state.preferences.settings,
        contentMounted: signals.editor.contentMounted,
        toggleCurrentWorkspaceItem: signals.workspace.toggleCurrentWorkspaceItem,
        settingChanged: signals.preferences.settingChanged,
        addNpmDependency: signals.editor.addNpmDependency,
        codeChanged: signals.editor.codeChanged,
        moduleSelected: signals.editor.moduleSelected,
        codeSaved: signals.editor.codeSaved,
        resizingStarted: signals.editor.resizingStarted,
        setDevtoolsOpen: signals.preferences.setDevtoolsOpen
    }))
    .toClass(
        (props) =>
            class EditorPreview extends React.Component<typeof props, State> {
                state: State = { width: null, height: null };
                interval: NodeJS.Timer;
                disposeEditorChange: () => void;
                el?: HTMLElement;
                devtools: DevTools;

                componentDidMount() {
                    this.props.contentMounted();
                    this.disposeEditorChange = reaction(() => this.props.settings.codeMirror, () => this.forceUpdate());

                    window.addEventListener('resize', this.getBounds);

                    this.interval = setInterval(() => {
                        this.getBounds();
                    }, 1000);
                }

                componentWillUnmount() {
                    this.disposeEditorChange();
                    window.removeEventListener('resize', this.getBounds);
                    clearInterval(this.interval);
                }

                getBounds = (el?) => {
                    if (el) {
                        this.el = this.el || el;
                    }
                    if (this.el) {
                        const { width, height } = this.el.getBoundingClientRect();

                        if (width !== this.state.width || height !== this.state.height) {
                            this.setState({ width, height });
                        }
                    }
                };

                handleToggleDevtools = (showDevtools) => {
                    if (this.devtools) {
                        if (showDevtools) {
                            this.devtools.openDevTools();
                        } else {
                            this.devtools.hideDevTools();
                        }
                    }
                };

                onInitialized = (codeEditor) => {
                    const {
                        preferences,
                        workspace,
                        editor,
                        parsedConfigurations,
                        currentModule,
                        errors,
                        corrections,
                        glyphs,
                        settings
                    } = this.props;
                    let isChangingSandbox = false;

                    const disposeSandboxChangeHandler = reaction(
                        () => editor.currentSandbox,
                        (newSandbox) => {
                            isChangingSandbox = !!codeEditor.changeSandbox;

                            // Put in a timeout so we allow the actions after the fork to execute first as well.
                            setTimeout(() => {
                                if (codeEditor.changeSandbox) {
                                    const { parsed } = parsedConfigurations.package;
                                    codeEditor
                                        .changeSandbox(
                                            newSandbox,
                                            currentModule,
                                            parsed ? parsed.dependencies : newSandbox.npmDependencies.toJS()
                                        )
                                        .then(() => {
                                            isChangingSandbox = false;
                                        });
                                }
                            });
                        }
                    );
                    const disposeErrorsHandler = reaction(
                        () => errors.map((error) => error),
                        (newErrors) => {
                            if (codeEditor.setErrors) {
                                codeEditor.setErrors(newErrors);
                            }
                        }
                    );
                    const disposeCorrectionsHandler = reaction(
                        () => corrections.map((correction) => correction),
                        (newCorrections) => {
                            if (codeEditor.setCorrections) {
                                codeEditor.setCorrections(newCorrections);
                            }
                        }
                    );
                    const disposeGlyphsHandler = reaction(
                        () => glyphs.map((glyph) => glyph),
                        (newGlyphs) => {
                            if (codeEditor.setGlyphs) {
                                codeEditor.setGlyphs(newGlyphs);
                            }
                        }
                    );
                    const disposeModulesHandler = reaction(this.detectStructureChange, () => {
                        if (isChangingSandbox) {
                            return;
                        }
                        if (codeEditor.updateModules) {
                            codeEditor.updateModules();
                        }
                    });
                    const disposePreferencesHandler = reaction(
                        () => ({ ...settings }),
                        (newSettings) => {
                            if (codeEditor.changeSettings) {
                                codeEditor.changeSettings(newSettings);
                            }
                        },
                        {
                            compareStructural: true
                        }
                    );
                    const disposeResizeHandler = reaction(
                        () => [ settings.zenMode, workspace.openedWorkspaceItem ],
                        () => {
                            setTimeout(() => {
                                this.getBounds();
                            });
                        }
                    );
                    const disposePackageHandler = reaction(
                        () => parsedConfigurations.package,
                        () => {
                            const { parsed } = parsedConfigurations.package;
                            if (parsed) {
                                const { dependencies = {} } = parsed;

                                if (codeEditor.changeDependencies) {
                                    codeEditor.changeDependencies(dependencies);
                                }
                            }
                        }
                    );
                    const disposeTSConfigHandler = reaction(
                        () => parsedConfigurations.typescript,
                        () => {
                            if (parsedConfigurations.typescript) {
                                const { parsed } = parsedConfigurations.typescript;
                                if (parsed) {
                                    if (codeEditor.setTSConfig) {
                                        codeEditor.setTSConfig(parsed);
                                    }
                                }
                            }
                        }
                    );
                    const disposeModuleHandler = reaction(
                        () => [ editor.currentModule, editor.currentModule.code ],
                        ([ newModule ]) => {
                            if (isChangingSandbox) {
                                return;
                            }
                            const editorModule = editor.currentModule;

                            const changeModule = codeEditor.changeModule;
                            if (newModule !== editorModule && changeModule) {
                                const trackedErrors = errors.map((e) => e);
                                const trackedCorrections = corrections.map((e) => e);
                                changeModule(newModule, trackedErrors, trackedCorrections);
                            } else if (codeEditor.changeCode) {
                                codeEditor.changeCode((newModule as typeof editor.currentModule).code || '');
                            }
                        }
                    );
                    const disposeToggleDevtools = reaction(
                        () => preferences.showDevtools,
                        (showDevtools) => {
                            this.handleToggleDevtools(showDevtools);
                        }
                    );

                    return () => {
                        disposeErrorsHandler();
                        disposeCorrectionsHandler();
                        disposeModulesHandler();
                        disposePreferencesHandler();
                        disposePackageHandler();
                        disposeTSConfigHandler();
                        disposeSandboxChangeHandler();
                        disposeModuleHandler();
                        disposeToggleDevtools();
                        disposeResizeHandler();
                        disposeGlyphsHandler();
                    };
                };

                detectStructureChange = () => {
                    const sandbox = this.props.currentSandbox;

                    return String(
                        sandbox.modules
                            .map((module) => module.id + module.directoryShortid + module.title)
                            .concat(
                                sandbox.directories.map((directory) => directory.directoryShortid + directory.title)
                            )
                    );
                };

                render() {
                    const {
                        currentModule,
                        isAllModulesSynced,
                        zenMode,
                        settings,
                        parsedConfigurations,
                        showDevtools,
                        isForkingSandbox,
                        openedWorkspaceItem
                    } = this.props;
                    const notSynced = !isAllModulesSynced;
                    const sandbox = this.props.currentSandbox;
                    const { x, y, width, content } = this.props.previewWindow;

                    const windowVisible = !!content;

                    const windowRightSize = -x + width + 16;

                    const isVerticalMode = this.state.width
                        ? this.state.width / 4 > this.state.width - windowRightSize
                        : false;

                    let editorWidth = isVerticalMode ? '100%' : `calc(100% - ${windowRightSize}px)`;
                    let editorHeight = isVerticalMode ? `${y + 16}px` : '100%';

                    if (!windowVisible) {
                        editorWidth = '100%';
                        editorHeight = '100%';
                    }

                    return (
                        <ThemeProvider
                            theme={{
                                templateColor: getTemplateDefinition(sandbox.template).color
                            }}
                        >
                            <FullSize>
                                <Prompt
                                    when={notSynced && !isForkingSandbox}
                                    message={() =>
                                        'You have not saved this sandbox, are you sure you want to navigate away?'}
                                />
                                {zenMode ? (
                                    <FilePath
                                        modules={sandbox.modules}
                                        directories={sandbox.directories}
                                        currentModule={currentModule}
                                        workspaceHidden={!openedWorkspaceItem}
                                        toggleWorkspace={() => {
                                            this.props.toggleCurrentWorkspaceItem();
                                        }}
                                        exitZenMode={() =>
                                            this.props.settingChanged({
                                                name: 'zenMode',
                                                value: false
                                            })}
                                    />
                                ) : (
                                    <Tabs />
                                )}
                                <div
                                    ref={this.getBounds}
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        flex: 1,
                                        marginTop: zenMode ? 0 : '2.5rem'
                                    }}
                                >
                                    <CodeEditor
                                        onInitialized={this.onInitialized}
                                        sandbox={sandbox}
                                        currentModule={currentModule}
                                        width={editorWidth}
                                        height={editorHeight}
                                        settings={settings}
                                        onNpmDependencyAdded={(name) => {
                                            if (sandbox.owned) {
                                                this.props.addNpmDependency({ name, isDev: true });
                                            }
                                        }}
                                        onChange={(code) =>
                                            this.props.codeChanged({
                                                code,
                                                moduleShortid: currentModule.shortid
                                            })}
                                        onModuleChange={(moduleId) => this.props.moduleSelected({ id: moduleId })}
                                        onSave={(code) =>
                                            this.props.codeSaved({
                                                code,
                                                moduleShortid: currentModule.shortid
                                            })}
                                        tsconfig={
                                            parsedConfigurations.typescript && parsedConfigurations.typescript.parsed
                                        }
                                    />
                                    <Preview width={this.state.width} height={this.state.height} />
                                </div>

                                <DevTools
                                    ref={(component) => {
                                        if (component) {
                                            this.devtools = component;
                                        }
                                    }}
                                    setDragging={() => this.props.resizingStarted()}
                                    sandboxId={sandbox.id}
                                    shouldExpandDevTools={showDevtools}
                                    zenMode={zenMode}
                                    setDevToolsOpen={(open) => this.props.setDevtoolsOpen({ open })}
                                />
                            </FullSize>
                        </ThemeProvider>
                    );
                }
            }
    );
