import * as React from 'react';
import { reaction } from 'mobx';
import { connect } from 'app/fluent';

import BasePreview from 'app/components/Preview';
import FlyingContainer from './FlyingContainer';

type Props = {
  width?: number
  height?: number
};

type State = {
  aligned?: 'right' | 'bottom'
};

export default connect<Props>()
  .with(({ state, signals }) => ({
    currentSandbox: state.editor.currentSandbox,
    isInProjectView: state.editor.isInProjectView,
    initialPath: state.editor.initialPath,
    forceRender: state.editor.forceRender,
    isAllModulesSynced: state.editor.isAllModulesSynced,
    settings: state.preferences.settings,
    currentPackageJSONCode: state.editor.currentPackageJSONCode,
    showDevtools: state.preferences.showDevtools,
    currentModule: state.editor.currentModule,
    previewWindow: state.editor.previewWindow,
    isResizing: state.editor.isResizing,
    setPreviewBounds: signals.editor.setPreviewBounds,
    errorsCleared: signals.editor.errorsCleared,
    previewActionReceived: signals.editor.previewActionReceived,
    viewModeChanged: signals.preferences.viewModeChanged,
    projectViewToggled: signals.editor.projectViewToggled

  }))
  .toClass(props =>
    class Preview extends React.Component<typeof props, State> {
      state: State = {
        aligned: 'right',
      };

      onPreviewInitialized = preview => {
        let preventCodeExecution = false;
        const disposeHandleProjectViewChange = reaction(
          () => this.props.isInProjectView,
          this.handleProjectView.bind(this, preview)
        );
        const disposeHandleForcedRenders = reaction(
          () => this.props.forceRender,
          this.handleExecuteCode.bind(this, preview)
        );
        const disposeHandleExternalResources = reaction(
          () => this.props.currentSandbox.externalResources.length,
          this.handleExecuteCode.bind(this, preview)
        );
        const disposeHandleModuleSyncedChange = reaction(
          () => this.props.isAllModulesSynced,
          this.handleModuleSyncedChange.bind(this, preview)
        );
        const disposeHandleCodeChange = reaction(
          () => this.props.currentModule.code,
          () => {
            if (preventCodeExecution) {
              preventCodeExecution = false;
              return;
            }
            this.handleCodeChange(preview);
          }
        );
        const disposeHandleModuleChange = reaction(
          () => this.props.currentModule,
          () => {
            if (this.props.isInProjectView) {
              preventCodeExecution = true;
            }
          }
        );
        const disposeHandleStructureChange = reaction(
          this.detectStructureChange,
          this.handleStructureChange.bind(this, preview)
        );
        const disposeHandleSandboxChange = reaction(
          () => this.props.currentSandbox.id,
          this.handleSandboxChange.bind(this, preview)
        );
        const disposeDependenciesHandler = reaction(
          () =>
            this.props.currentSandbox.npmDependencies.keys().length,
          this.handleDependenciesChange.bind(this, preview)
        );

        return () => {
          disposeHandleModuleChange();
          disposeHandleProjectViewChange();
          disposeHandleForcedRenders();
          disposeHandleExternalResources();
          disposeHandleModuleSyncedChange();
          disposeHandleCodeChange();
          disposeHandleStructureChange();
          disposeHandleSandboxChange();
          disposeDependenciesHandler();
        };
      };

      detectStructureChange = () => {
        const sandbox = this.props.currentSandbox;

        return String(
          sandbox.modules
            .map(module => module.directoryShortid + module.title)
            .concat(
              sandbox.directories.map(
                directory => directory.directoryShortid + directory.title
              )
            )
        );
      };

      componentWillReceiveProps(props) {
        const { width, height } = props;

        if (this.state.aligned) {
          if (width !== this.props.width || height !== this.props.height) {
            if (this.state.aligned === 'bottom') {
              this.props.setPreviewBounds(
                this.getBottomCoordinates(props)
              );
            } else {
              this.props.setPreviewBounds(
                this.getRightCoordinates(props)
              );
            }
          }
        } else if (width && height) {
          let newWidth = props.previewWindow.width;
          if (
            width - 16 <
            props.previewWindow.width -
              props.previewWindow.x
          ) {
            newWidth = Math.max(
              64,
              width - 16 + props.previewWindow.x
            );
          }

          let newHeight = props.previewWindow.height;
          if (
            height - 16 <
            props.previewWindow.height +
              props.previewWindow.y
          ) {
            newHeight = Math.max(
              64,
              height - 16 - props.previewWindow.y
            );
          }

          if (width !== this.props.width || height !== this.props.height) {
            props.setPreviewBounds({
              width: newWidth,
              height: newHeight,
            });
          }
        }
      }

      handleSandboxChange = (preview, newId) => {
        preview.handleSandboxChange(newId);
      };

      handleDependenciesChange = preview => {
        preview.handleDependenciesChange();
      };

      handleCodeChange = preview => {
        const settings = this.props.settings;
        if (settings.livePreviewEnabled) {
          if (settings.instantPreviewEnabled) {
            preview.executeCodeImmediately();
          } else {
            preview.executeCode();
          }
        }
      };

      handleStructureChange = preview => {
        const settings = this.props.settings;
        if (settings.livePreviewEnabled) {
          if (settings.instantPreviewEnabled) {
            preview.executeCodeImmediately();
          } else {
            preview.executeCode();
          }
        }
      };

      handleModuleSyncedChange = (preview, change) => {
        if (change) {
          preview.executeCodeImmediately();
        }
      };

      handleExecuteCode = preview => {
        preview.executeCodeImmediately();
      };

      handleProjectView = preview => {
        this.forceUpdate(() => {
          preview.executeCodeImmediately();
        });
      };

      resetAlignment = () => {
        this.setState({ aligned: null });
      };

      getBottomCoordinates = (props = this.props) => ({
        x: 0,
        y: (props.height || 0) / 2 - 16,
        width: (props.width || 0) - 16,
        height: (props.height || 0) / 2,
      });

      getRightCoordinates = (props = this.props) => ({
        x: 0,
        y: 0,
        width: (props.width || 0) / 2,
        height: (props.height || 0) - 16,
      });

      render() {
        const { previewWindow, currentPackageJSONCode } = this.props;

        const packageJSON = {
          path: '/package.json',
          code: currentPackageJSONCode,
        };

        if (!previewWindow.content) {
          return null;
        }

        return (
          <FlyingContainer onPositionChange={this.resetAlignment}>
            {({ resize }) => (
              <BasePreview
                onInitialized={this.onPreviewInitialized}
                sandbox={this.props.currentSandbox}
                extraModules={{ '/package.json': packageJSON }}
                currentModule={this.props.currentModule}
                settings={this.props.settings}
                initialPath={this.props.initialPath}
                isInProjectView={this.props.isInProjectView}
                onClearErrors={() => this.props.errorsCleared()}
                onAction={action =>
                  this.props.previewActionReceived({ action })
                }
                onOpenNewWindow={() =>
                  this.props.viewModeChanged({
                    showEditor: true,
                    showPreview: false,
                  })
                }
                onToggleProjectView={() => this.props.projectViewToggled()}
                showDevtools={this.props.showDevtools}
                isResizing={this.props.isResizing}
                alignRight={() => {
                  resize(this.getRightCoordinates());
                  this.setState({ aligned: 'right' });
                }}
                alignBottom={() => {
                  resize(this.getBottomCoordinates());
                  this.setState({ aligned: 'bottom' });
                }}
              />
            )}
          </FlyingContainer>
        );
      }
    }
  )
