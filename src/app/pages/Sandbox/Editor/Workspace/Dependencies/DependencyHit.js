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
