import React from 'react';
import { inject, observer } from 'mobx-react';

import Option from './Option';
import { Container, Arrow, OrderName, OverlayContainer } from './elements';

import OverlayComponent from '../Overlay';

const FIELD_TO_NAME = {
  updatedAt: 'Last Modified',
  insertedAt: 'Last Created',
  title: 'Name',
};

class SortOptions extends React.Component {
  toggleSort = e => {
    e.preventDefault();
    const orderBy = this.props.store.dashboard.orderBy;
    const orderByChanged = this.props.signals.dashboard.orderByChanged;
    orderByChanged({
      orderBy: {
        order: orderBy.order === 'asc' ? 'desc' : 'asc',
        field: orderBy.field,
      },
    });
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
    const { field, order } = this.props.store.dashboard.orderBy;

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
          field="insertedAt"
          name={FIELD_TO_NAME.insertedAt}
        />
        <Option
          setField={this.setField}
          currentField={field}
          field="updatedAt"
          name={FIELD_TO_NAME.updatedAt}
        />
      </OverlayContainer>
    );

    return (
      <OverlayComponent Overlay={Overlay}>
        {open => (
          <Container>
            Sort by{' '}
            <OrderName onClick={open}>{FIELD_TO_NAME[field]} </OrderName>
            <Arrow onClick={this.toggleSort} isAscending={order === 'asc'} />
          </Container>
        )}
      </OverlayComponent>
    );
  }
}

export default inject('store', 'signals')(observer(SortOptions));
