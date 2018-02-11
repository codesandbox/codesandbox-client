// @flow
import * as React from 'react';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';

import BasePreview from 'app/components/Preview';
import FlyingContainer from './FlyingContainer';

type Props = {
  width: ?number,
  height: ?number,
  store: any,
  signals: any,
};

type State = {
  aligned: ?'right' | 'bottom',
};

class Preview extends React.Component<Props, State> {
  state = {
    aligned: 'right',
  };

  onPreviewInitialized = preview => {
    let preventCodeExecution = false;
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
      () => this.props.store.editor.currentModule.code,
      () => {
        if (preventCodeExecution) {
          preventCodeExecution = false;
          return;
        }
        this.handleCodeChange(preview);
      }
    );
    const disposeHandleModuleChange = reaction(
      () => this.props.store.editor.currentModule,
      () => {
        if (this.props.store.editor.isInProjectView) {
          preventCodeExecution = true;
        }
      }
    );
    const disposeHandleStructureChange = reaction(
      this.detectStructureChange,
      this.handleStructureChange.bind(this, preview)
    );
    const disposeHandleSandboxChange = reaction(
      () => this.props.store.editor.currentSandbox.id,
      this.handleSandboxChange.bind(this, preview)
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
      disposeHandleSandboxChange();
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
            this.getBottomCoordinates(props)
          );
        } else {
          this.props.signals.editor.setPreviewBounds(
            this.getRightCoordinates(props)
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

  handleSandboxChange = (preview, newId) => {
    preview.handleSandboxChange(newId);
  };

  handleDependenciesChange = preview => {
    preview.handleDependenciesChange();
  };

  handleCodeChange = preview => {
    const settings = this.props.store.preferences.settings;
    if (settings.livePreviewEnabled) {
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
    const { store, signals } = this.props;

    const packageJSON = {
      path: '/package.json',
      code: store.editor.currentPackageJSONCode,
    };

    if (!store.editor.previewWindow.content) {
      return null;
    }

    return (
      <FlyingContainer onPositionChange={this.resetAlignment}>
        {({ resize }) => (
          <BasePreview
            onInitialized={this.onPreviewInitialized}
            sandbox={store.editor.currentSandbox}
            extraModules={{ '/package.json': packageJSON }}
            currentModule={store.editor.currentModule}
            settings={store.preferences.settings}
            initialPath={store.editor.initialPath}
            isInProjectView={store.editor.isInProjectView}
            onClearErrors={() =>
              store.editor.errors.length && signals.editor.errorsCleared()
            }
            onAction={action =>
              signals.editor.previewActionReceived({ action })
            }
            onOpenNewWindow={() =>
              this.props.signals.preferences.viewModeChanged({
                showEditor: true,
                showPreview: false,
              })
            }
            onToggleProjectView={() => signals.editor.projectViewToggled()}
            showDevtools={store.preferences.showDevtools}
            isResizing={store.editor.isResizing}
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

export default inject('signals', 'store')(observer(Preview));
