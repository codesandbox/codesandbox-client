import React from 'react';
import { Highlight } from 'react-instantsearch/dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.gray};
  background: ${props => props.theme.background2};
  color: ${props => props.theme.white};
`;

const Left = styled.div`flex: 1;`;

const Right = styled.div``;

const Row = styled.div`
  margin: 10px;
  & > * {
    margin-right: 10px;
  }
`;

const Downloads = styled.span`
  color: ${props => props.theme.gray};
  font-size: 12px;
`;

const License = styled.span`
  border: 1px solid ${props => props.theme.gray};
  border-radius: 3px;
  padding: 1px 3px;
  color: ${props => props.theme.gray};
  font-size: 12px;
`;

type Props = {
  hit: Object,
};

export default function DependencyHit({ hit }: Props) {
  return (
    <Container>
      <Left>
        <Row>
          <Highlight attributeName="name" hit={hit} />
          <Downloads>{hit.downloadsLast30Days}</Downloads>
          {hit.license && <License>{hit.license}</License>}
        </Row>
        <Row>{hit.description}</Row>
      </Left>
      <Right>
        <Row>github link</Row>
      </Right>
    </Container>
  );
}

export function hitComponent(makeOnClick) {
  return ({ hit }: { hit: Object }) => {
    const onClick = makeOnClick(hit);
    return (
      <div role="button" tabIndex={0} onClick={onClick}>
        <DependencyHit hit={hit} />
      </div>
    );
  };
}
