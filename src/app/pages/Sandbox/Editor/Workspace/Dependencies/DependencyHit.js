import React from 'react';
import { Highlight } from 'react-instantsearch/dom';

type Props = {
  hit: Object,
};

export default function DependencyHit({ hit }: Props) {
  return (
    <div>
      <Highlight attributeName="name" hit={hit} />
    </div>
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
