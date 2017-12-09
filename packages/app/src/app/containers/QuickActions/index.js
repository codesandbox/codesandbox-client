import React from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Downshift from 'downshift';
import genie from 'geniejs/dist/geniejs.es';

import { userKeybindingsSelector } from 'app/store/preferences/selectors';
import { quickActionsOpenSelector } from 'app/store/view/selectors';
import viewActions from 'app/store/view/actions';
import Input from 'app/components/Input';

import Keys from './Keys';

type Props = {
  sandboxId: string,
  keybindings: {
    [key: string]: {
      title: string,
      type: string,
      bindings: [Array<string>, ?Array<string>],
      action: Function,
    },
  },
  bindingStrings: {
    [combo: string]: string,
  },
  dispatch: Function,
  quickActionsOpen: boolean,
};

const Container = styled.div`
  position: absolute;

  top: 20vh;
  left: 0;
  right: 0;

  z-index: 60;

  margin: auto;
  padding-bottom: 0.25rem;

  background-color: ${props => props.theme.background};

  max-width: 650px;
  width: 100%;

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.6);

  color: rgba(255, 255, 255, 0.6);
`;

const Items = styled.div`
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const InputContainer = styled.div`
  padding: 0.5rem;
  input {
    width: 100%;
  }
`;

const Entry = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${props => props.theme.secondary.clearer(0.7)};
      color: rgba(255, 255, 255, 0.8);
    `};
`;

const Title = styled.div`
  flex: 1;
`;

const Keybindings = styled.div`
  float: right;
`;

const mapStateToProps = createSelector(
  userKeybindingsSelector,
  quickActionsOpenSelector,
  (newBindings, quickActionsOpen) => ({
    keybindings: newBindings,
    quickActionsOpen,
  })
);
const mapDispatchToProps = dispatch => ({
  dispatch,
});
class QuickActions extends React.Component<Props> {
  updateGenie = () => {
    Object.keys(this.props.keybindings).forEach(bindingKey => {
      const quickAction = this.props.keybindings[bindingKey];

      genie({
        magicWords: `${quickAction.type}: ${quickAction.title}`,
        id: bindingKey,
        action: () =>
          this.props.dispatch(quickAction.action({ id: this.props.sandboxId })),
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
    this.props.dispatch(viewActions.setQuickActionsOpen(false));
  };

  onChange = item => {
    genie.makeWish(item);
    this.closeQuickActions();
  };

  render() {
    if (!this.props.quickActionsOpen) {
      return null;
    }

    const { keybindings } = this.props;

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
          }) => (
            <div style={{ width: '100%' }}>
              <InputContainer>
                <Input
                  {...getInputProps({
                    innerRef: el => el && el.focus(),
                    onKeyUp: this.handleKeyUp,
                    // Timeout so the fuzzy handler can still select the module
                    onBlur: () => setTimeout(this.closeQuickActions, 100),
                  })}
                />
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
                      {keybindings[item.id].type}: {keybindings[item.id].title}
                    </Title>

                    {keybindings[item.id].bindings &&
                      keybindings[item.id].bindings[0] && (
                        <Keybindings>
                          <Keys bindings={keybindings[item.id].bindings[0]} />
                          {keybindings[item.id].bindings[1] &&
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
          )}
        </Downshift>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuickActions);
