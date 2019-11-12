import { Reaction } from '..';

let _preview;
let _reaction: Reaction;

export default {
  initialize(reaction: Reaction) {
    _reaction = reaction;
  },
  initializePreview(preview: any) {
    _preview = preview;

    const dispose = _reaction(
      state => [
        state.editor.isAllModulesSynced,
        state.editor.currentSandbox.template,
        state.preferences.settings.livePreviewEnabled,
      ],
      ([isAllModulesSynced, template, livePreviewEnabled]) => {
        if (
          isAllModulesSynced &&
          (template === 'static' || !livePreviewEnabled)
        ) {
          _preview.handleRefresh();
        }
      }
    );

    _preview.executeCodeImmediately();

    return () => {
      _preview = null;
      dispose();
    };
  },
  executeCodeImmediately() {
    if (!_preview) {
      return;
    }
    _preview.executeCodeImmediately();
  },
  executeCode() {
    if (!_preview) {
      return;
    }
    _preview.executeCode();
  },
  refresh() {
    if (!_preview) {
      return;
    }
    _preview.handleRefresh();
  },
};
