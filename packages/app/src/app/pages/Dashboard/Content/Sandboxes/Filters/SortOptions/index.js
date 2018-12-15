import React from 'react';
import { inject, observer } from 'mobx-react';
import OverlayComponent from 'app/components/Overlay';

import Option from './Option';
import { Container, Arrow, OrderName, OverlayContainer } from './elements';

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
    const { hideOrder } = this.props;

    const Overlay = () => (
      <OverlayContainer>
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
      <OverlayComponent event="Dashboard - Order By" Overlay={Overlay}>
        {open => (
          <Container hideOrder={hideOrder}>
            Sort by{' '}
            <OrderName onClick={open}>{FIELD_TO_NAME[field]} </OrderName>
            <Arrow
              onClick={this.toggleSort}
              style={{
                transform: `rotate(${order === 'asc' ? -180 : 0}deg)`,
                fontSize: '.875rem',
                marginLeft: 4,
              }}
            />
          </Container>
        )}
      </OverlayComponent>
    );
  }
}

export default inject('store', 'signals')(observer(SortOptions));
