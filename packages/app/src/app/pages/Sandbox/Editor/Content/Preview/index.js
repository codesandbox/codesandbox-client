// @flow
import React, { Component } from 'react';
import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';

import BasePreview from 'app/components/Preview';
import RunOnClick from 'common/lib/components/RunOnClick';
import getTemplate from 'common/lib/templates';

type Props = {
  width?: number | string,
  height?: number | string,
  hidden?: boolean,
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

    const packageJSON = {
      path: '/package.json',
      code: store.editor.currentPackageJSONCode,
    };

    const completelyHidden = !store.editor.previewWindowVisible;

    return this.state.running ? (
      <BasePreview
        onInitialized={this.onPreviewInitialized}
        sandbox={store.editor.currentSandbox}
        extraModules={{ '/package.json': packageJSON }}
        currentModule={store.editor.currentModule}
        settings={store.preferences.settings}
        initialPath={store.editor.initialPath}
        isInProjectView={store.editor.isInProjectView}
        onClearErrors={() => signals.editor.errorsCleared()}
        onAction={action => signals.editor.previewActionReceived({ action })}
        alignDirection={this.state.aligned}
        hide={this.props.hidden}
        noPreview={completelyHidden}
        onOpenNewWindow={() =>
          signals.preferences.viewModeChanged({
            showEditor: true,
            showPreview: false,
          })
        }
        onToggleProjectView={() => signals.editor.projectViewToggled()}
        showDevtools={store.preferences.showDevtools}
        isResizing={store.editor.isResizing}
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
    );
  }
}

export default inject('signals', 'store')(observer(Preview));
