import React, { useEffect, useCallback } from 'react';
import Downshift from 'downshift';
import genie from 'geniejs';

import { useOvermind } from 'app/overmind';

import { ESC } from '@codesandbox/common/lib/utils/keycodes';

import Input from '@codesandbox/common/lib/components/Input';
import Keys from './Keys';

import {
  Container,
  Items,
  InputContainer,
  Entry,
  Title,
  Keybindings,
} from './elements';

export const QuickActions: React.FunctionComponent = () => {
  const {
    state,
    state: {
      preferences: { keybindings },
      editor: { quickActionsOpen },
    },
    actions,
    actions: { editor },
  } = useOvermind();

  const loadGenie = useCallback(() => {
    try {
      const { enteredMagicWords } = JSON.parse(
        window.localStorage.getItem('genie')
      );
      genie.options({ enteredMagicWords });
    } catch (error) {
      // it may not exist in localStorage yet, or the JSON was malformed somehow
      // so we'll persist it to update localStorage so it doesn't throw an error
      // next time the page is loaded.
      persistGenie();
    }
  }, []);

  const updateGenie = useCallback(() => {
    Object.keys(keybindings).forEach(bindingKey => {
      const {
        quickAction: { type, title, signal, payload },
      } = keybindings[bindingKey];

      genie({
        magicWords: `${type}: ${title}`,
        id: bindingKey,
        action: () => {
          const signalPath = signal.split('.');
          const signalFn = signalPath.reduce(
            (currentSignal, key) => currentSignal[key],
            actions
          );
          const payloadVal =
            typeof payload === 'function' ? payload(state) : payload || {};
          signalFn(payloadVal);
        },
      });
    });
  }, [actions, keybindings, state]);

  useEffect(() => {
    updateGenie();
    loadGenie();
  }, [loadGenie, updateGenie]);

  useEffect(() => {
    updateGenie();
  }, [keybindings, updateGenie]);

  if (!quickActionsOpen) {
    return null;
  }

  const getItems = value => genie.getMatchingWishes(value);

  const handleKeyUp = e => {
    if (e.keyCode === ESC) {
      closeQuickActions();
    }
  };

  const closeQuickActions = () => {
    editor.quickActionsClosed();
  };

  const persistGenie = () => {
    const { enteredMagicWords } = genie.options();
    window.localStorage.setItem('genie', JSON.stringify({ enteredMagicWords }));
  };

  let inputVal = '';
  const onChange = item => {
    genie.makeWish(item, inputVal);
    persistGenie();
    closeQuickActions();
  };

  const itemToString = item => item && item.magicWords.join(', ');

  return (
    <Container>
      <Downshift
        defaultHighlightedIndex={0}
        defaultIsOpen
        onChange={onChange}
        itemToString={itemToString}
      >
        {({
          getInputProps,
          getItemProps,
          selectedItem,
          inputValue,
          highlightedIndex,
        }) => {
          const inputProps = getInputProps({
            onChange: (ev: React.ChangeEvent<HTMLInputElement>) => {
              inputVal = ev.target.value;
            },
            innerRef: (el: any) => el && el.focus(),
            onKeyUp: handleKeyUp,
            // Timeout so the fuzzy handler can still select the module
            onBlur: () => setTimeout(closeQuickActions, 100),
          } as any);
          return (
            <div style={{ width: '100%' }}>
              <InputContainer>
                <Input {...inputProps} value={inputProps.value || ''} />
              </InputContainer>

              <Items>
                {getItems(inputValue).map((item, index) => (
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
                      {keybindings[item.id].type}: {keybindings[item.id].title}
                    </Title>

                    {keybindings[item.id].bindings &&
                      keybindings[item.id].bindings[0] && (
                        <Keybindings>
                          <Keys bindings={keybindings[item.id].bindings[0]} />
                          {keybindings[item.id].bindings.length === 2 &&
                            keybindings[item.id].bindings[1] &&
                            keybindings[item.id].bindings[1].length && (
                              <>
                                {' - '}
                                <Keys
                                  bindings={keybindings[item.id].bindings[1]}
                                />
                              </>
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
};
