/* @flow */
import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { observe, reaction } from 'mobx';
import BasePreview from './BasePreview';

class Preview extends React.Component {
  onPreviewInitialized = preview => {
    const disposeHandleProjectViewChange = observe(
      this.props.store.editor,
      'isInProjectView',
      this.handleExecuteCode.bind(this, preview)
    );
    const disposeHandleForcedRenders = observe(
      this.props.store.editor,
      'forceRender',
      this.handleExecuteCode.bind(this, preview)
    );
    const disposeHandleExternalResources = observe(
      this.props.store.editor.currentSandbox,
      'externalResources',
      this.handleExecuteCode.bind(this, preview)
    );
    const disposeHandleModuleSyncedChange = observe(
      this.props.store.editor,
      'isAllModulesSynced',
      this.handleModuleSyncedChange.bind(this, preview)
    );
    const disposeHandleCodeChange = observe(
      this.props.store.editor.currentModule,
      'code',
      this.handleCodeChange.bind(this, preview)
    );
    const disposeHandleStructureChange = reaction(
      this.detectStructureChange,
      this.handleStructureChange.bind(this, preview)
    );

    return () => {
      disposeHandleProjectViewChange();
      disposeHandleForcedRenders();
      disposeHandleExternalResources();
      disposeHandleModuleSyncedChange();
      disposeHandleCodeChange();
      disposeHandleStructureChange();
    };
  };

  detectStructureChange = () => {
    const sandbox = this.props.store.editor.currentSandbox;

    return String(
      sandbox.modules
        .map(module => module.directoryShortid)
        .concat(
          sandbox.directories.map(directory => directory.directoryShortid)
        )
    );
  };

  handleCodeChange = (preview, change) => {
    const settings = this.props.store.editor.preferences.settings;
    if (settings.livePreviewEnabled) {
      if (settings.instantPreviewEnabled) {
        preview.executeCodeImmediately();
      } else {
        preview.executeCode();
      }
    }
  };

  handleStructureChange = preview => {
    const settings = this.props.store.editor.preferences.settings;
    if (settings.livePreviewEnabled) {
      if (settings.instantPreviewEnabled) {
        preview.executeCodeImmediately();
      } else {
        preview.executeCode();
      }
    }
  };

  handleModuleSyncedChange = (preview, change) => {
    if (!change.oldValue && change.newValue) {
      preview.executeCodeImmediately();
    }
  };

  handleExecuteCode = preview => {
    preview.executeCodeImmediately();
  };

  render() {
    const { store, signals } = this.props;

    return (
      <BasePreview
        onInitialized={this.onPreviewInitialized}
        sandbox={store.editor.currentSandbox}
        currentModule={store.editor.mainModule}
        settings={store.editor.preferences.settings}
        initialPath={store.editor.initialPath}
        isInProjectView={store.editor.preferences.isInProjectView}
        onClearErrors={() =>
          store.editor.errors.length && signals.editor.errorsCleared()
        }
        onAction={action => signals.editor.previewActionReceived({ action })}
        onOpenNewWindow={() =>
          this.props.signals.editor.preferences.viewModeChanged({
            showEditor: true,
            showPreview: false,
          })
        }
        showDevtools={store.editor.preferences.showDevtools}
      />
    );
  }
}

export default inject('signals', 'store')(observer(Preview));
