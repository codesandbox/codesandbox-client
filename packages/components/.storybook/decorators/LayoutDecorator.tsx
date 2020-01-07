import React from 'react';
import styled from 'styled-components';

const ColoredChildren = styled.div`
  & > div > * {
    --color: rgb(103, 126, 208);
    background: var(--color);
    min-height: 4em;
    min-width: 4em;
  }
  & > div > *:nth-child(6n + 2) {
    --color: rgb(217, 103, 219);
  }
  & > div > *:nth-child(6n + 3) {
    --color: rgb(77, 214, 115);
  }
  & > div > *:nth-child(6n + 4) {
    --color: rgb(248, 110, 91);
  }
  & > div > *:nth-child(6n + 5) {
    --color: rgb(94, 204, 211);
  }
  & > div > *:nth-child(6n + 6) {
    --color: rgb(0, 35, 208);
  }
  & > div > *:nth-child(6n + 7) {
    --color: rgb(224, 174, 72);
  }
`;

export const LayoutDecorator = story => (
  <ColoredChildren>{story()}</ColoredChildren>
);
