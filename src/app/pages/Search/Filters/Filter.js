import React from 'react';
import styled from 'styled-components';

import { RefinementList } from 'react-instantsearch/dom';

const Container = styled.div`
  padding: 1rem;
  background-color: ${props => props.theme.background};
  box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.24);
  border-radius: 2px;
  margin-bottom: 1rem;

  .ais-SearchBox__wrapper {
    margin-bottom: 0.5rem;
  }

  .ais-SearchBox__reset {
    top: 0.25rem;
  }

  .ais-SearchBox__input {
    font-size: 0.875rem;
    padding-left: 2.5em;
  }
`;

const Title = styled.div`
  font-weight: 300;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

type Props = {
  title: string,
  attributeName: string,
  operator: string,
  noSearch: ?boolean,
};

export default ({ title, attributeName, operator, noSearch }: Props) => (
  <Container>
    <Title>{title}</Title>
    <RefinementList
      withSearchBox={!noSearch}
      showMore={!noSearch}
      operator={operator}
      attributeName={attributeName}
    />
  </Container>
);
