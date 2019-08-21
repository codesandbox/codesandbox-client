/*
  THIS EFFECT IS TO BE DEPRECATED AS SOON AS POSSIBLE
*/

import {
  KEYBINDINGS,
  normalizeKey,
} from '@codesandbox/common/lib/utils/keybindings';

const isIOS =
  typeof navigator !== 'undefined' &&
  Boolean(navigator.platform.match(/(iPhone|iPod|iPad)/i));

const state = {
  keybindings: null,
  keydownIndex: 0,
  pendingPrimaryBindings: [],
  pendingSecondaryBindings: [],
  timeout: null,
};

function reset() {
  state.keydownIndex = 0;
  state.pendingPrimaryBindings = [];
  state.pendingSecondaryBindings = [];
}

function getAction(path, actions) {
  const actionPath = path.split('.');
  return actionPath.reduce((aggr, key) => aggr[key], actions);
}

function handleKeyUp() {
  state.keydownIndex = 0;
}

function hasAnyKeyModifier(event: KeyboardEvent) {
  return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
}

function hasKeyModifier(event: KeyboardEvent, modifier: string) {
  return {
    Shift: event.shiftKey,
    Alt: event.altKey,
    Control: event.ctrlKey,
    Meta: event.metaKey,
  }[modifier];
}

function handleIosKeyDown(overmindInstance, event, _pressedKey) {
  // the linter doesn't allow to change parameters' values.
  let pressedKey = _pressedKey;
  // iOS shortcuts only work if there's at least one modifier key at work (shift or alt).
  // I'm aborting this handling right here to minimize the number of cycles needed for
  // every key press.
  if (!hasAnyKeyModifier(event)) {
    return;
  }
  // This is just here to facilitate testing on a desktop environment since on desktop we do get
  // pressedKey === 'Alt' (on iOS you'd get pressedKey === 'Dead').
  if (pressedKey.length > 1) {
    pressedKey = '';
  }

  const filterMatchingBindings = function filterMatchingBindings(
    pendingBindings
  ) {
    return pendingBindings
      .map(binding => {
        const bindingKeys = binding.bindings[0];
        // Sanity check
        if (!bindingKeys || bindingKeys.length === 0) {
          return null;
        }

        // Try to match the currently pressed keys with the binding keys. Generate new
        // keys for the bindings matched that correspond to the remaining keys needed to be
        // pressed in order to have a hit.
        let matchedKeyIndex = -1;
        for (let i = 0; i < bindingKeys.length; i++) {
          const keyToMatch = bindingKeys[i];
          if (keyToMatch === pressedKey) {
            matchedKeyIndex = i;
            break;
          }
          // We try to consume as many modifiers as possible before we find the key to match.
          if (!hasKeyModifier(event, keyToMatch)) {
            break;
          }
        }

        if (matchedKeyIndex === -1) {
          // No key was matched so we skip this binding.
          return null;
        }

        return {
          ...binding,
          bindings: [
            binding.bindings[0].slice(matchedKeyIndex + 1),
            binding.bindings[1],
          ],
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.bindings.length < b.bindings.length);
  };

  // We filter out any hits on full list of bindings on first key down, or just move
  // on filtering on existing pending bindings
  state.pendingPrimaryBindings = filterMatchingBindings(
    state.keydownIndex === 0 ? state.keybindings : state.pendingPrimaryBindings
  );

  state.keydownIndex++;

  const longestBinding =
    state.pendingPrimaryBindings[state.pendingPrimaryBindings.length - 1];
  if (!longestBinding) {
    // Nothing matched so back to the beginning!
    reset();
    return;
  }

  // We partially matched some bindings so avoid printing that key.
  event.preventDefault();
  event.stopPropagation();

  for (let i = state.pendingPrimaryBindings.length - 1; i >= 0; i--) {
    const completedBinding = state.pendingPrimaryBindings[i];
    // Check if the binding has actually been completed, if it has then we have already
    // processed all completed bindings since they're ordered as such.
    if (completedBinding.bindings[0].length > 0) {
      break;
    }

    // This binding has been completed (not more keys needed to match) so call its payload
    // function or add it as a pending secondary binding.
    if (completedBinding.bindings.length > 0 && completedBinding.bindings[1]) {
      this.pendingSecondaryBindings.push(completedBinding);
    } else {
      const keybinding = KEYBINDINGS[completedBinding.key];

      reset();
      event.preventDefault();
      event.stopPropagation();

      const payload =
        typeof keybinding.payload === 'function'
          ? keybinding.payload(overmindInstance.state)
          : keybinding.payload || {};

      getAction(keybinding.signal, overmindInstance.actions)(payload);
      // When we find a completed binding and call its payload, we're done.
      break;
    }
  }
}

function handleKeyDown(overmindInstance, e) {
  if (state.timeout) {
    clearTimeout(state.timeout);
  }
  if (e.defaultPrevented) {
    return;
  }

  state.timeout = setTimeout(reset, 1500);

  const key = normalizeKey(e);

  if (!key) {
    return;
  }

  if (isIOS) {
    handleIosKeyDown(overmindInstance, e, key);
    return;
  }
  // First we check if we have any pending secondary bindings to identify
  if (state.pendingSecondaryBindings.length) {
    // We filter out any hits by verifying that the current key matches the next
    // key in line for the pending bindings
    state.pendingSecondaryBindings = state.pendingSecondaryBindings.filter(
      binding =>
        binding.bindings.length > 1 &&
        binding.bindings[1].length > state.keydownIndex &&
        binding.bindings[1][state.keydownIndex] === key
    );

    // We get a hit if the current key matches the last key in the binding
    const secondaryBindingHit = state.pendingSecondaryBindings.find(
      binding => binding.bindings[1][binding.bindings[1].length - 1] === key
    );

    // When we get a hit we grab the actual binding and trigger it, resetting the state.
    // We also return from this function
    if (secondaryBindingHit) {
      const keybinding = KEYBINDINGS[secondaryBindingHit.key];

      reset();
      e.preventDefault();
      e.stopPropagation();

      const payload =
        typeof keybinding.payload === 'function'
          ? keybinding.payload(overmindInstance.state)
          : keybinding.payload || {};

      getAction(keybinding.signal, overmindInstance.actions)(payload);

      return;
    }
  }

  // We do not want to make any analysis if multiple keys are pressed and
  // there are no pending primary bindings
  if (state.keydownIndex > 0 && !state.pendingPrimaryBindings.length) {
    return;
  }

  // We filter out any hits on full list of bindings on first key down, or just move
  // on filtering on existing pending bindings
  state.pendingPrimaryBindings = (state.keydownIndex === 0
    ? state.keybindings
    : state.pendingPrimaryBindings
  ).filter(
    binding =>
      binding.bindings.length &&
      binding.bindings[0] &&
      binding.bindings[0].length > state.keydownIndex &&
      binding.bindings[0][state.keydownIndex] === key
  );

  // We find possibly multiple hits as secondary bindings might have the same primary binding. We
  // sort by bindings length to identify if a primary binding should trigger. It might happen that a
  // user creates a primary binding that triggers something, but also same primary binding with a secondary
  // binding which is invalid... we trigger the primary binding
  const primaryBindingHits = state.pendingPrimaryBindings
    .filter(
      binding => binding.bindings[0][binding.bindings[0].length - 1] === key
    )
    .sort((a, b) => (a.bindings.length <= b.bindings.length ? -1 : 1));

  // We move through the hits and trigger any primary binding, reset and return. Or we
  // add it as a pending secondary binding
  for (let x = 0; x < primaryBindingHits.length; x++) {
    const binding = primaryBindingHits[x];

    if (binding.bindings.length === 1 || !binding.bindings[1]) {
      const keybinding = KEYBINDINGS[binding.key];

      reset();
      e.preventDefault();
      e.stopPropagation();

      const payload =
        typeof keybinding.payload === 'function'
          ? keybinding.payload(overmindInstance.state)
          : keybinding.payload || {};

      getAction(keybinding.signal, overmindInstance.actions)(payload);

      return;
    }

    state.pendingSecondaryBindings = state.pendingSecondaryBindings.concat(
      binding
    );
  }

  // As long as we have pending primary bindings (and possibly secondary) we want to add to keydown
  if (state.pendingPrimaryBindings.length) {
    state.keydownIndex++;
  } else {
    state.keydownIndex = 0;
  }
}

let onKeyUp = null;
let onKeyDown = null;
let isStarted = false;
let _overmindInstance;

export default {
  initialize(overmindInstance) {
    _overmindInstance = overmindInstance;
    onKeyDown = handleKeyDown.bind(null, overmindInstance);
    onKeyUp = handleKeyUp.bind(null);
  },
  set(userKeybindings = []) {
    const keybindings = [...userKeybindings];

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
  start() {
    if (
      isStarted ||
      _overmindInstance.state.preferences.settings.experimentVSCode
    ) {
      return;
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    isStarted = true;
  },
  pause() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    isStarted = false;
  },
};
