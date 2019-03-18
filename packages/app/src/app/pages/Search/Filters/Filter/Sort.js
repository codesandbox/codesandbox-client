import React, { Component } from 'react';
import Down from 'react-icons/lib/md/expand-more';
import Up from 'react-icons/lib/md/expand-less';
import { SortBy } from 'react-instantsearch-dom';

import { Container, Title, Button } from './elements';

class Filter extends Component {
  state = { open: false };

  toggle = () => this.setState(({ open }) => ({ open: !open }));
  render() {
    const { title, defaultRefinement, items } = this.props;
    const { open } = this.state;
    return (
      <Container open={open}>
        <Title>
          <span>{title}</span>
          <Button onClick={this.toggle}>{open ? <Up /> : <Down />}</Button>
        </Title>
        <SortBy defaultRefinement={defaultRefinement} items={items} />
      </Container>
    );
  }
}
export default Filter;
