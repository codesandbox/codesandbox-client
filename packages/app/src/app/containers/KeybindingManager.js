import React, { KeyboardEvent } from 'react';
import { inject } from 'mobx-react';
import { KEYBINDINGS, normalizeKey } from 'app/store/preferences/keybindings';

class KeybindingManager extends React.Component {
  constructor(props) {
    super(props);
    this.pressedComboKeys = [];
    this.pressedComboMetaKeys = [];
    this.pressedSpecialKeys = [];
    this.setBindings();
  }
  setBindings() {
    const bindings = this.getBindings();

    this.bindingStrings = bindings.bindingStrings;
    this.keybindings = bindings.keybindings;
    this.checkedStrokes = this.bindingStrings;
  }
  getBindings = () => {
    const userBindings = this.props.store.editor.preferences.settings
      .keybindings;
    const userBindingsMap = userBindings.reduce(
      (bindings, binding) =>
        Object.assign(bindings, {
          [binding.key]: binding.bindings,
        }),
      {}
    );
    const keybindings = Object.keys(KEYBINDINGS).reduce(
      (currentBindings, key) =>
        Object.assign(currentBindings, {
          [key]: Object.assign(
            {},
            KEYBINDINGS[key],
            key in userBindingsMap ? { bindings: userBindingsMap[key] } : {}
          ),
        }),
      {}
    );
    const bindingStrings = {};

    Object.keys(keybindings).forEach(key => {
      const binding = keybindings[key];

      if (binding.bindings[0]) {
        const bindingString = binding.bindings[0].join('');

        if (binding.bindings.length === 2 && binding.bindings[1].length) {
          bindingStrings[bindingString] = {
            [binding.bindings[1].join('')]: key,
          };
        } else {
          bindingStrings[bindingString] = key;
        }
      }
    });

    return { keybindings, bindingStrings };
  };

  removeFromPressedComboKeys = key => {
    this.pressedComboKeys = this.pressedComboKeys.filter(x => x !== key);
  };

  handleKeyDown = e => {
    if (this.props.store.currentModal) {
      return;
    }

    const key = normalizeKey(e);

    if (this.pressedComboKeys.indexOf(key) === -1) {
      this.pressedComboKeys.push(key);

      // if the meta key is pressed
      // register the keyCode also in seperate array
      if (e.metaKey) {
        this.pressedComboMetaKeys.push(key);
      }
    }

    // We also register special keys, sometimes key ups are not registered
    // for special keys, so after every 2 seconds we clear the array
    if (this.pressedSpecialKeys.indexOf(key) === -1) {
      this.pressedSpecialKeys.push(key);

      clearTimeout(this.specialTimeout);
      this.specialTimeout = setTimeout(() => {
        this.pressedSpecialKeys.forEach(k => {
          this.removeFromPressedComboKeys(k);
        });
      }, 1500);
    }

    // check match
    const match = this.checkCombosForPressedKeys();

    if (match != null) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (typeof match === 'string') {
      this.pressedComboKeys = [];
      this.pressedComboMetaKeys = [];
      this.pressedSpecialKeys = [];
      this.checkedStrokes = this.bindingStrings;

      this.keybindings[match].action(this.props.signals);
    } else if (typeof match === 'object') {
      this.checkedStrokes = match;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.checkedStrokes = this.bindingStrings;
      }, 300);
    }
  };

  checkCombosForPressedKeys() {
    const pressedComboKeysStr = this.pressedComboKeys.join('');

    return this.checkedStrokes[pressedComboKeysStr];
  }

  handleKeyUp = (e: KeyboardEvent) => {
    const key = normalizeKey(e);

    this.removeFromPressedComboKeys(key);
    if (this.pressedComboMetaKeys.length > 0) {
      // if there are keys that were pressed while
      // the meta key was pressed flush them
      // because the keyup wasn't triggered for them
      // @see http:// stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key

      this.pressedComboMetaKeys.forEach(metaKey =>
        this.removeFromPressedComboKeys(metaKey)
      );
      this.pressedComboMetaKeys = [];
    }
  };

  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  componentDidUpdate() {
    this.setBindings();
  }

  render() {
    return null;
  }
}

export default inject('signals', 'store')(KeybindingManager);
