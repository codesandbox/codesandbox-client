import { Provider } from '@cerebral/fluent';
import { KEYBINDINGS, normalizeKey } from 'common/utils/keybindings';

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

function handleKeyUp() {
  state.keydownIndex = 0;
}

function handleKeyDown(controller, e) {
  if (state.timeout) {
    clearTimeout(state.timeout);
  }

  state.timeout = setTimeout(reset, 1500);

  const key = normalizeKey(e);

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
          ? keybinding.payload(controller.getState())
          : keybinding.payload || {};

      controller.getSignal(keybinding.signal)(payload);

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
    .sort((a, b) => a.bindings.length < b.bindings.length);

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
          ? keybinding.payload(controller.getState())
          : keybinding.payload || {};

      controller.getSignal(keybinding.signal)(payload);

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

export default Provider({
  set(userKeybindings = []) {
    const keybindings = userKeybindings.concat(
      Object.keys(KEYBINDINGS).reduce(
        (currentKeybindings, key) =>
          currentKeybindings.concat({
            key,
            bindings: KEYBINDINGS[key].bindings,
          }),
        []
      )
    );

    state.keybindings = keybindings.filter(
      binding => binding.bindings && binding.bindings.length
    );
  },
  start() {
    if (isStarted) {
      return;
    }

    onKeyDown = handleKeyDown.bind(null, this.context.controller);
    onKeyUp = handleKeyUp.bind(null);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    isStarted = true;
  },
  pause() {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    isStarted = false;
  },
});
