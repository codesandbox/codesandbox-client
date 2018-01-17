import React, { KeyboardEvent } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { normalizeKey } from 'app/store/preferences/keybindings';
import { userKeybindingsSelector } from 'app/store/preferences/selectors';
import { modalSelector } from 'app/store/modal/selectors';

type Props = {
  sandboxId: string,
  keybindings: {
    [key: string]: {
      title: string,
      bindings: [Array<string>, ?Array<string>],
      action: Function,
    },
  },
  bindingStrings: {
    [combo: string]: string,
  },
  dispatch: Function,
  modalOpen: boolean,
};

const mapStateToProps = createSelector(
  userKeybindingsSelector,
  modalSelector,
  (newBindings, modal) => {
    const bindingStrings = {};

    Object.keys(newBindings).forEach(key => {
      const binding = newBindings[key];

      if (binding.bindings[0]) {
        const bindingString = binding.bindings[0].join('');

        if (binding.bindings[1] && binding.bindings[1].length) {
          bindingStrings[bindingString] = {
            [binding.bindings[1].join('')]: key,
          };
        } else {
          bindingStrings[bindingString] = key;
        }
      }
    });

    return { keybindings: newBindings, bindingStrings, modalOpen: modal.open };
  }
);
const mapDispatchToProps = dispatch => ({
  dispatch,
});
class KeybindingManager extends React.Component<Props> {
  pressedComboKeys = [];
  pressedComboMetaKeys = [];
  pressedSpecialKeys = [];
  checkedStrokes = this.props.bindingStrings;

  removeFromPressedComboKeys = (key: string) => {
    this.pressedComboKeys = this.pressedComboKeys.filter(x => x !== key);
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (this.props.modalOpen) {
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
      this.checkedStrokes = this.props.bindingStrings;

      this.props.dispatch(
        this.props.keybindings[match].action({
          id: this.props.sandboxId,
        })
      );
    } else if (typeof match === 'object') {
      this.checkedStrokes = match;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.checkedStrokes = this.props.bindingStrings;
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
    this.checkedStrokes = this.props.bindingStrings;
  }

  render() {
    return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeybindingManager);
