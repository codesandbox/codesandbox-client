import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Mousetrap from 'mousetrap';
import 'mousetrap/plugins/global-bind/mousetrap-global-bind.min';
import 'mousetrap/plugins/pause/mousetrap-pause.min';

import { KEYBINDINGS } from 'app/store/preferences/keybindings';
import { keybindingsSelector } from 'app/store/preferences/selectors';
import { modalSelector } from 'app/store/modal/selectors';

type Props = {
  sandboxId: string,
  keybindings: {
    [key: string]: {
      bindings: [Array<string>, ?Array<string>],
      action: Function,
    },
  },
  dispatch: Function,
  modalOpen: boolean,
};

const mapStateToProps = createSelector(
  keybindingsSelector,
  () => KEYBINDINGS,
  modalSelector,
  (userKeybindings, defaultBindings, modal) => {
    const newBindings = { ...defaultBindings };
    Object.keys(userKeybindings).forEach(key => {
      newBindings[key].bindings = userKeybindings[key];
    });

    return { keybindings: newBindings, modalOpen: modal.open };
  }
);
const mapDispatchToProps = dispatch => ({
  dispatch,
});
class KeybindingManager extends React.Component<Props> {
  setBindings = () => {
    Mousetrap.reset();
    Object.keys(this.props.keybindings).forEach(k => {
      const { bindings, action } = this.props.keybindings[k]; // eslint-disable-line
      const stroke =
        bindings[0].join('+') +
        (bindings[1] && bindings[1].length ? ' ' + bindings[1].join('+') : '');

      Mousetrap.bindGlobal(stroke.toLowerCase(), () => {
        this.props.dispatch(action({ id: this.props.sandboxId }));
        return false;
      });
    });
  };

  shouldComponentUpdate(nextProps: Props) {
    if (nextProps.modalOpen) {
      Mousetrap.pause();
    } else {
      Mousetrap.unpause();
    }

    return nextProps.keybindings !== this.props.keybindings;
  }

  componentWillMount() {
    this.setBindings();
  }

  componentDidUpdate() {
    this.setBindings();
  }

  componentWillUnmount() {
    Mousetrap.reset();
  }

  render() {
    return null;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(KeybindingManager);
