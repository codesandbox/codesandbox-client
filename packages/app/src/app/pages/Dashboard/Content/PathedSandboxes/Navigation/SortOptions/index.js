import React from 'react';
import ArrowDown from 'react-icons/lib/md/arrow-downward';
import { Transition } from 'react-spring';
import { inject, observer } from 'mobx-react';

import Option from './Option';
import { Container, OrderName, OverlayContainer } from './elements';

const Empty = () => <span />;

const FIELD_TO_NAME = {
  updated_at: 'Last Modified',
  inserted_at: 'Last Created',
  title: 'Name',
};

class SortOptions extends React.Component {
  state = {
    showModal: false,
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.listenForClick);
  }

  listenForClick = (e: MouseEvent) => {
    if (!e.defaultPrevented && this.state.showModal) {
      this.setState({ showModal: false });
    }
  };

  toggleModal = () => {
    this.setState(state => ({ showModal: !state.showModal }));
  };

  setField = (field: string) => {
    const orderBy = this.props.store.dashboard.orderBy;
    const orderByChanged = this.props.signals.dashboard.orderByChanged;
    orderByChanged({
      orderBy: {
        order: orderBy.order,
        field,
      },
    });
  };

  render() {
    const { showModal } = this.state;
    const { field } = this.props.store.dashboard.orderBy;

    const Overlay = style => (
      <OverlayContainer style={style}>
        <Option
          setField={this.setField}
          currentField={field}
          field="title"
          name={FIELD_TO_NAME.title}
        />
        <Option
          setField={this.setField}
          currentField={field}
          field="inserted_at"
          name={FIELD_TO_NAME.inserted_at}
        />
        <Option
          setField={this.setField}
          currentField={field}
          field="updated_at"
          name={FIELD_TO_NAME.updated_at}
        />
      </OverlayContainer>
    );

    return (
      <Container onMouseDown={e => e.preventDefault()}>
        Sort by{' '}
        <OrderName onClick={this.toggleModal}>
          {FIELD_TO_NAME[field]} <ArrowDown />
        </OrderName>
        <Transition
          from={{ height: 0, opacity: 0 }}
          enter={{ height: 'auto', opacity: 1 }}
          leave={{ height: 0, opacity: 0 }}
        >
          {/* TODO: Fix this */}
          {showModal ? Overlay : Empty}
        </Transition>
      </Container>
    );
  }
}

export default inject('store', 'signals')(observer(SortOptions));
