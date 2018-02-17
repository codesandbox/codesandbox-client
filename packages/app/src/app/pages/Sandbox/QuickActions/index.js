import React from 'react';
import { inject, observer } from 'mobx-react';
import Downshift from 'downshift';
import genie from 'geniejs/dist/geniejs.es';

import Input from 'common/components/Input';
import Keys from './Keys';

import {
  Container,
  Items,
  InputContainer,
  Entry,
  Title,
  Keybindings,
} from './elements';

class QuickActions extends React.Component {
  updateGenie = () => {
    const keybindings = this.props.store.preferences.keybindings.get();
    const signals = this.props.signals;

    Object.keys(keybindings).forEach(bindingKey => {
      const quickAction = keybindings[bindingKey];

      genie({
        magicWords: `${quickAction.type}: ${quickAction.title}`,
        id: bindingKey,
        action: () => {
          const signalPath = quickAction.signal.split('.');
          const signal = signalPath.reduce(
            (currentSignal, key) => currentSignal[key],
            signals
          );
          const payload =
            typeof quickAction.payload === 'function'
              ? quickAction.payload(this.props.store)
              : quickAction.payload || {};
          signal(payload);
        },
      });
    });
  };

  componentDidMount() {
    this.updateGenie();
  }

  componentDidUpdate() {
    this.updateGenie();
  }

  getItems = value => genie.getMatchingWishes(value);

  handleKeyUp = e => {
    if (e.keyCode === 27) {
      this.closeQuickActions();
    }
  };

  closeQuickActions = () => {
    this.props.signals.editor.quickActionsClosed();
  };

  onChange = item => {
    genie.makeWish(item);
    this.closeQuickActions();
  };

  itemToString = item => item && item.magicWords.join(', ');

  render() {
    if (!this.props.store.editor.quickActionsOpen) {
      return null;
    }

    const keybindings = this.props.store.preferences.keybindings.get();

    return (
      <Container>
        <Downshift
          defaultHighlightedIndex={0}
          defaultIsOpen
          onChange={this.onChange}
          itemToString={this.itemToString}
        >
          {({
            getInputProps,
            getItemProps,
            selectedItem,
            inputValue,
            highlightedIndex,
          }) => {
            const inputProps = getInputProps({
              innerRef: el => el && el.focus(),
              onKeyUp: this.handleKeyUp,
              // Timeout so the fuzzy handler can still select the module
              onBlur: () => setTimeout(this.closeQuickActions, 100),
            });
            return (
              <div style={{ width: '100%' }}>
                <InputContainer>
                  <Input {...inputProps} value={inputProps.value || ''} />
                </InputContainer>

                <Items>
                  {this.getItems(inputValue).map((item, index) => (
                    <Entry
                      {...getItemProps({
                        item,
                        index,
                        isActive: highlightedIndex === index,
                        isSelected: selectedItem === item,
                      })}
                      key={item.id}
                    >
                      <Title>
                        {keybindings[item.id].type}:{' '}
                        {keybindings[item.id].title}
                      </Title>

                      {keybindings[item.id].bindings &&
                        keybindings[item.id].bindings[0] && (
                          <Keybindings>
                            <Keys bindings={keybindings[item.id].bindings[0]} />
                            {keybindings[item.id].bindings.length === 2 &&
                              keybindings[item.id].bindings[1] &&
                              keybindings[item.id].bindings[1].length && (
                                <React.Fragment>
                                  {' - '}
                                  <Keys
                                    bindings={keybindings[item.id].bindings[1]}
                                  />
                                </React.Fragment>
                              )}
                          </Keybindings>
                        )}
                    </Entry>
                  ))}
                </Items>
              </div>
            );
          }}
        </Downshift>
      </Container>
    );
  }
}

export default inject('signals', 'store')(observer(QuickActions));
