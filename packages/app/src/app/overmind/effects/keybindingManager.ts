/*
  THIS EFFECT IS TO BE DEPRECATED AS SOON AS POSSIBLE
*/

import { KEYBINDINGS } from '@codesandbox/common/lib/utils/keybindings';

const state = {
  keybindings: null as Array<{ key: string; bindings: string[] }> | null,
  keydownIndex: 0,
  pendingPrimaryBindings: [] as Array<{ key: string; bindings: string[] }>,
  pendingSecondaryBindings: [] as Array<{ key: string; bindings: string[] }>,
  timeout: null as NodeJS.Timeout | null,
};

export default {
  initialize() {},
  set(userKeybindings = []) {
    const keybindings = [...userKeybindings] as Array<{
      key: string;
      bindings: string[];
    }>;

    Object.keys(KEYBINDINGS).forEach(bindingName => {
      if (keybindings.find(x => x.key === bindingName)) {
        return;
      }

      keybindings.push({
        key: bindingName,
        bindings: KEYBINDINGS[bindingName].bindings,
      });
    });

    state.keybindings = keybindings.filter(
      binding => binding.bindings && binding.bindings.filter(Boolean).length
    );
  },
  start() {},
  pause() {},
};
