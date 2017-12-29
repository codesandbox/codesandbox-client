import { Provider } from 'cerebral';
import { KEYBINDINGS, normalizeKey } from 'app/utils/keybindings';

const state = {
  bindingStrings: null,
  keybindings: null,
  checkedStrokes: null,
  pressedComboKeys: [],
  pressedComboMetaKeys: [],
  pressedSpecialKeys: [],
  specialTimeout: null,
  timeout: null,
  signals: null,
};

function removeFromPressedComboKeys(key) {
  state.pressedComboKeys = state.pressedComboKeys.filter(x => x !== key);
}

function checkCombosForPressedKeys() {
  const pressedComboKeysStr = state.pressedComboKeys.join('');

  return state.checkedStrokes[pressedComboKeysStr];
}

function handleKeyUp(e) {
  const key = normalizeKey(e);

  removeFromPressedComboKeys(key);
  if (state.pressedComboMetaKeys.length > 0) {
    // if there are keys that were pressed while
    // the meta key was pressed flush them
    // because the keyup wasn't triggered for them
    // @see http:// stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key

    state.pressedComboMetaKeys.forEach(metaKey =>
      removeFromPressedComboKeys(metaKey)
    );
    state.pressedComboMetaKeys = [];
  }
}

function handleKeyDown(controller, e) {
  const key = normalizeKey(e);

  if (state.pressedComboKeys.indexOf(key) === -1) {
    state.pressedComboKeys.push(key);

    // if the meta key is pressed
    // register the keyCode also in seperate array
    if (e.metaKey) {
      state.pressedComboMetaKeys.push(key);
    }
  }

  // We also register special keys, sometimes key ups are not registered
  // for special keys, so after every 2 seconds we clear the array
  if (state.pressedSpecialKeys.indexOf(key) === -1) {
    state.pressedSpecialKeys.push(key);

    clearTimeout(state.specialTimeout);
    state.specialTimeout = setTimeout(() => {
      state.pressedSpecialKeys.forEach(k => {
        removeFromPressedComboKeys(k);
      });
    }, 1500);
  }

  // check match
  const match = checkCombosForPressedKeys();

  if (match != null) {
    e.preventDefault();
    e.stopPropagation();
  }

  if (typeof match === 'string') {
    state.pressedComboKeys = [];
    state.pressedComboMetaKeys = [];
    state.pressedSpecialKeys = [];
    state.checkedStrokes = state.bindingStrings;

    controller.getSignal(state.keybindings[match].signal)(
      state.keybindings[match].payload || {}
    );
  } else if (typeof match === 'object') {
    state.checkedStrokes = match;

    if (state.timeout) {
      clearTimeout(state.timeout);
    }

    state.timeout = setTimeout(() => {
      state.checkedStrokes = state.bindingStrings;
    }, 300);
  }
}

let onKeyUp = null;
let onKeyDown = null;

export default Provider({
  set(userKeybindings = []) {
    const userKeybindingsByKey = userKeybindings.reduce(
      (bindings, binding) =>
        Object.assign(bindings, {
          [binding.key]: binding.bindings,
        }),
      {}
    );

    const keybindings = Object.keys(KEYBINDINGS).reduce(
      (currentKeybindings, key) => {
        const binding = Object.assign(
          {},
          KEYBINDINGS[key],
          userKeybindingsByKey[key]
            ? {
                bindings: userKeybindingsByKey[key],
              }
            : {}
        );

        return Object.assign(currentKeybindings, {
          [key]: binding,
        });
      },
      {}
    );

    state.bindingStrings = {};

    Object.keys(keybindings).forEach(key => {
      const binding = keybindings[key];

      if (binding.bindings[0]) {
        const bindingString = binding.bindings[0].join('');

        if (binding.bindings.length === 2 && binding.bindings[1].length) {
          state.bindingStrings[bindingString] = {
            [binding.bindings[1].join('')]: key,
          };
        } else {
          state.bindingStrings[bindingString] = key;
        }
      }
    });

    state.keybindings = keybindings;
    state.checkedStrokes = state.bindingStrings;
  },
  start() {
    onKeyDown = handleKeyDown.bind(null, this.context.controller);
    onKeyUp = handleKeyUp.bind(null);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  },
  pause() {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
  },
});
