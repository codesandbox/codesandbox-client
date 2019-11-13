import { blocker } from 'app/utils/blocker';

import { Reaction } from '..';

let _preview = blocker<any>();
let _reaction: Reaction;

export default {
  initialize(reaction: Reaction) {
    _reaction = reaction;
  },
  initializePreview(preview: any) {
    _preview.resolve(preview);

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
          preview.handleRefresh();
        }
      }
    );

    return () => {
      dispose();
      _preview = blocker<any>();
    };
  },
  async executeCodeImmediately(initialRender?: boolean) {
    const preview = await _preview.promise;
    preview.executeCodeImmediately(initialRender);
  },
  async executeCode() {
    const preview = await _preview.promise;
    preview.executeCode();
  },
  async refresh() {
    const preview = await _preview.promise;
    preview.handleRefresh();
  },
  async refreshUrl() {
    const preview = await _preview.promise;
    preview.refreshUrl();
  },
};
