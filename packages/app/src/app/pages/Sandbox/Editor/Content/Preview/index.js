// @flow
import React, { Component, Fragment } from 'react';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';

import BasePreview from 'app/components/Preview';
import RunOnClick from 'common/components/RunOnClick';
import getTemplate from 'common/templates';

import FlyingContainer from './FlyingContainer';
import Tests from './DevTools/Tests';
import Console from './DevTools/Console';

type Props = {
  width: ?number,
  height: ?number,
  store: any,
  signals: any,
  runOnClick?: boolean,
};

type State = {
  aligned: ?'right' | 'bottom',
};

class Preview extends Component<Props, State> {
  state = {
    aligned: window.innerHeight > window.innerWidth ? 'bottom' : 'right',
    running: !this.props.runOnClick,
  };

  onPreviewInitialized = preview => {
    const disposeHandleProjectViewChange = reaction(
      () => this.props.store.editor.isInProjectView,
      this.handleProjectView.bind(this, preview)
    );
    const disposeHandleForcedRenders = reaction(
      () => this.props.store.editor.forceRender,
      this.handleExecuteCode.bind(this, preview)
    );
    const disposeHandleExternalResources = reaction(
      () => this.props.store.editor.currentSandbox.externalResources.length,
      this.handleExecuteCode.bind(this, preview)
    );
    const disposeHandleModuleSyncedChange = reaction(
      () => this.props.store.editor.isAllModulesSynced,
      this.handleModuleSyncedChange.bind(this, preview)
    );
    const disposeHandleCodeChange = reaction(
      () =>
        String(this.props.store.editor.currentSandbox.modules.map(m => m.code)),
      () => {
        this.handleCodeChange(preview);
      }
    );
    const disposeHandleModuleChange = reaction(
      () => this.props.store.editor.currentModule,
      () => {
        if (!this.props.store.editor.isInProjectView) {
          this.handleCodeChange(preview);
        }
      }
    );
    const disposeHandleStructureChange = reaction(
      this.detectStructureChange,
      this.handleStructureChange.bind(this, preview)
    );
    const disposeDependenciesHandler = reaction(
      () =>
        this.props.store.editor.currentSandbox.npmDependencies.keys().length,
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
      disposeDependenciesHandler();
    };
  };

  detectStructureChange = () => {
    const sandbox = this.props.store.editor.currentSandbox;

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

  componentWillReceiveProps(props: Props) {
    const { width, height } = props;

    if (this.state.aligned) {
      if (width !== this.props.width || height !== this.props.height) {
        if (this.state.aligned === 'bottom') {
          this.props.signals.editor.setPreviewBounds(
            this.getBottomCoordinates(
              props,
              1 - this.props.store.editor.previewWindow.editorSize / 100
            )
          );
        } else {
          this.props.signals.editor.setPreviewBounds(
            this.getRightCoordinates(
              props,
              1 - this.props.store.editor.previewWindow.editorSize / 100
            )
          );
        }
      }
    } else if (width && height) {
      let newWidth = props.store.editor.previewWindow.width;
      if (
        width - 16 <
        props.store.editor.previewWindow.width -
          props.store.editor.previewWindow.x
      ) {
        newWidth = Math.max(
          64,
          width - 16 + props.store.editor.previewWindow.x
        );
      }

      let newHeight = props.store.editor.previewWindow.height;
      if (
        height - 16 <
        props.store.editor.previewWindow.height +
          props.store.editor.previewWindow.y
      ) {
        newHeight = Math.max(
          64,
          height - 16 - props.store.editor.previewWindow.y
        );
      }

      if (width !== this.props.width || height !== this.props.height) {
        props.signals.editor.setPreviewBounds({
          width: newWidth,
          height: newHeight,
        });
      }
    }
  }

  handleDependenciesChange = preview => {
    preview.handleDependenciesChange();
  };

  handleCodeChange = preview => {
    const settings = this.props.store.preferences.settings;
    const isServer = getTemplate(
      this.props.store.editor.currentSandbox.template
    ).isServer;
    if (!isServer && settings.livePreviewEnabled) {
      if (settings.instantPreviewEnabled) {
        preview.executeCodeImmediately();
      } else {
        preview.executeCode();
      }
    }
  };

  handleStructureChange = preview => {
    const settings = this.props.store.preferences.settings;
    if (settings.livePreviewEnabled) {
      if (settings.instantPreviewEnabled) {
        preview.executeCodeImmediately();
      } else {
        preview.executeCode();
      }
    }
  };

  handleModuleSyncedChange = (preview, change) => {
    const settings = this.props.store.preferences.settings;
    const isServer = getTemplate(
      this.props.store.editor.currentSandbox.template
    ).isServer;
    if ((isServer || !settings.livePreviewEnabled) && change) {
      if (this.props.store.editor.currentSandbox.template === 'static') {
        preview.handleRefresh();
      } else {
        preview.executeCodeImmediately();
      }
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

  resetAlignment = (
    xChanged,
    yChanged,
    widthChanged,
    heightChanged,
    newSizes
  ) => {
    const { aligned } = this.state;

    if (
      ((widthChanged || !yChanged) && aligned === 'bottom') ||
      ((heightChanged || xChanged) && aligned === 'right')
    ) {
      this.setState({ aligned: null });
    } else if (aligned === 'right' && newSizes.width) {
      this.props.signals.editor.editorSizeUpdated({
        editorSize: (1 - newSizes.width / this.props.width) * 100,
      });
    } else if (aligned === 'bottom' && newSizes.height) {
      this.props.signals.editor.editorSizeUpdated({
        editorSize: (1 - newSizes.height / this.props.height) * 100,
      });
    }
  };

  getBottomCoordinates = (props = this.props, previewSizeScalar = 0.5) => ({
    x: 0,
    y: (props.height || 0) * (1 - previewSizeScalar) - 16,
    width: (props.width || 0) - 16,
    height: (props.height || 0) * previewSizeScalar,
  });

  getRightCoordinates = (props = this.props, previewSizeScalar = 0.5) => ({
    x: 0,
    y: 0,
    width: (props.width || 0) * previewSizeScalar,
    height: (props.height || 0) - 16,
  });

  render() {
    const { store, signals } = this.props;
    const content = store.editor.previewWindow.content;

    const packageJSON = {
      path: '/package.json',
      code: store.editor.currentPackageJSONCode,
    };

    const hide = content !== 'browser';
    const completelyHidden = !content;

    return (
      <FlyingContainer
        hide={completelyHidden}
        onPositionChange={this.resetAlignment}
      >
        {({ resize }) => {
          const alignRight = e => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            resize(this.getRightCoordinates());
            this.setState({ aligned: 'right' });
            this.props.signals.editor.editorSizeUpdated({
              editorSize: 50,
            });
          };
          const alignBottom = e => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            resize(this.getBottomCoordinates());
            this.setState({ aligned: 'bottom' });
            this.props.signals.editor.editorSizeUpdated({
              editorSize: 50,
            });
          };

          return (
            <Fragment>
              {content === 'tests' && (
                <Tests alignRight={alignRight} alignBottom={alignBottom} />
              )}
              {content === 'console' && (
                <Console alignRight={alignRight} alignBottom={alignBottom} />
              )}
              {this.state.running ? (
                <BasePreview
                  onInitialized={this.onPreviewInitialized}
                  sandbox={store.editor.currentSandbox}
                  extraModules={{ '/package.json': packageJSON }}
                  currentModule={store.editor.currentModule}
                  settings={store.preferences.settings}
                  initialPath={store.editor.initialPath}
                  isInProjectView={store.editor.isInProjectView}
                  onClearErrors={() => signals.editor.errorsCleared()}
                  onAction={action =>
                    signals.editor.previewActionReceived({ action })
                  }
                  alignDirection={this.state.aligned}
                  hide={hide}
                  noPreview={completelyHidden}
                  onOpenNewWindow={() =>
                    signals.preferences.viewModeChanged({
                      showEditor: true,
                      showPreview: false,
                    })
                  }
                  onToggleProjectView={() =>
                    signals.editor.projectViewToggled()
                  }
                  showDevtools={store.preferences.showDevtools}
                  isResizing={store.editor.isResizing}
                  alignRight={alignRight}
                  alignBottom={alignBottom}
                  setServerStatus={(status: string) => {
                    signals.server.statusChanged({ status });
                  }}
                  syncSandbox={signals.files.syncSandbox}
                />
              ) : (
                <RunOnClick
                  onClick={() => {
                    this.setState({ running: true });
                  }}
                />
              )}
            </Fragment>
          );
        }}
      </FlyingContainer>
    );
  }
}

export default inject('signals', 'store')(observer(Preview));
